import { IJwtPayload } from '@auth/interfaces';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoleEnum } from '@role/role-enum';
import { UserService } from '@user/user.service';
import { PrismaService } from 'nestjs-prisma';
import { NotesStatuses } from 'src/note-status/note-status-enum';
import { CreateNoteHistoryDto } from './dto/create-note-history.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { PaginationNoteDto } from './dto/pagination-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
    ) {}

    async create(data: CreateNoteDto) {
        const connectToUserObjs =
            await this.getConnectObjsUpdateCreateFlow(data);
        const { executor, approver, registrar, signatory, ...other } = data;
        return this.prisma.note.create({
            data: {
                noteStatus: {
                    connect: {
                        name: NotesStatuses.created,
                    },
                },
                ...other,
                ...connectToUserObjs,
            },
        });
    }

    async findAll(paginationDto: PaginationNoteDto, user: IJwtPayload) {
        const idsKeys: string[] = [];
        const whereIn: string[] = [];

        const rolesIncludesRole = (role: RoleEnum) => {
            return user.roles.includes(role)
        }

        if (rolesIncludesRole(RoleEnum.approver)) {
            idsKeys.push('approverId');
            whereIn.push(NotesStatuses.approving);
        }
        if (rolesIncludesRole(RoleEnum.signatory)) {
            idsKeys.push('signatoryId');
            whereIn.push(NotesStatuses.signing);
        }
        if (rolesIncludesRole(RoleEnum.executor)) {
            idsKeys.push('executorId');
            whereIn.push(
                NotesStatuses.created,
                NotesStatuses.approved,
                NotesStatuses.signed,
                NotesStatuses.registered,
                NotesStatuses.revising,
            );
        }
        if (rolesIncludesRole(RoleEnum.registrar)) {
            idsKeys.push('registrarId');
            whereIn.push(NotesStatuses.registrating);
        }
        const where: Prisma.NoteWhereInput = {
            AND: [
                {
                    OR: idsKeys.map((keyId) => ({
                        [keyId]: user.id,
                    })),
                },
                {
                    noteStatus: {
                        name: {
                            in: whereIn,
                        },
                    },
                },
            ],
        };

        const { page, pageSize } = paginationDto;

        const selectOpt = {
            select: {
                username: true,
            },
        };

        const notes = await this.prisma.note.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                noteStatus: true,
                approver: selectOpt,
                executor: selectOpt,
                registrar: selectOpt,
                signatory: selectOpt,
            },
        });

        const totalNotes = await this.prisma.note.count({ where });

        return {
            data: notes,
            total: totalNotes,
        };
    }

    async findOne(id: string) {
        const note = await this.prisma.note.findUnique({
            where: { id },
            include: {
                noteStatus: true,
            },
        });
        if(!note) throw new NotFoundException(`Служебная записка c id: ${id} не существует`)
        return note
    }

    async update(
        id: string,
        userId: string,
        { status, ...data }: UpdateNoteDto,
    ) {
        const connectToUserObjs = await this.getConnectObjsUpdateCreateFlow(data);
        const { executor, approver, registrar, signatory, ...other } = data;

        const statusConnectObj = status && {
            connect: {
                name: status,
            },
        };

        const updatedNote = await this.prisma.note.update({
            where: { id },
            data: {
                noteStatus: statusConnectObj,
                ...other,
                ...connectToUserObjs,
            },
        });

        await this.createNoteHistory({ status, userId, noteId: id });
        return updatedNote;
    }

    async submitForApprovalRegistration(
        id: string,
        user: IJwtPayload,
        data: UpdateNoteDto,
        status: NotesStatuses,
        registrarOrApprover: 'registrar' | 'approver',
    ) {
        const note = await this.findOne(id);
        const statusName  = note.noteStatus.name 
        if (
            note.executorId !== user.id ||
            statusName !== NotesStatuses.created &&
            statusName !== NotesStatuses.revising &&
            statusName !== NotesStatuses.signed && 
            statusName !== NotesStatuses.approved
        )
            throw new ForbiddenException();
        const isCorrectReq =
            (data.recipient || note.recipient) &&
            (data.executor || note.executorId) &&
            (data[registrarOrApprover] || note[registrarOrApprover]);
        if (!isCorrectReq) throw new BadRequestException();

        let isForbidden: boolean;
        const isApprover = registrarOrApprover === 'approver';
        if (isApprover)
            isForbidden = (await this.noteHistoryAlreadyIncludeStatus(
                id,
                NotesStatuses.approved,
            )) || (await this.noteHistoryAlreadyIncludeStatus(
                id,
                NotesStatuses.signed,
            ))
        else
            isForbidden = await this.noteHistoryAlreadyIncludeStatus(
                id,
                NotesStatuses.registered,
            );

        if (isForbidden)
            throw new ForbiddenException(
                `Данная записка уже была ${isApprover ? 'согласована' : 'зарегистрирована'}.`,
            );

        return this.update(id, user.id, {
            ...data,
            status,
        });
    }

    async sign(id: string, data: UpdateNoteDto, user: IJwtPayload) {
        const note = await this.findOne(id);
        if (
            note.signatoryId !== user.id ||
            note.noteStatus.name !== NotesStatuses.signing
        )
            throw new ForbiddenException();

        return this.update(id, user.id, {
            ...data,
            status: NotesStatuses.signed,
        });
    }

    async approve(id: string, data: UpdateNoteDto, user: IJwtPayload) {
        const note = await this.findOne(id);
        if (
            note.approverId !== user.id ||
            note.noteStatus.name !== NotesStatuses.approving
        )
            throw new ForbiddenException();

        let status: NotesStatuses;
        if (data.signatory || note.signatoryId) status = NotesStatuses.signing;
        else status = NotesStatuses.approved

        return this.update(id, user.id, {
            ...data,
            status,
        });
    }
    async register(id: string, data: UpdateNoteDto, user: IJwtPayload) {
        const note = await this.findOne(id);
        if (
            note.registrarId !== user.id ||
            note.noteStatus.name !== NotesStatuses.registrating
        )
            throw new ForbiddenException();

        const isCorrectReq =
            (data.regNum || note.regNum) && (data.regDate || note.regDate);
        if (!isCorrectReq) throw new BadRequestException();

        return this.update(id, user.id, {
            ...data,
            status: NotesStatuses.registered,
        });
    }

    async reject(id: string, data: UpdateNoteDto, user: IJwtPayload) {
        const note = await this.findOne(id);
        const statusName = note.noteStatus.name
        if (
            (note.registrarId !== user.id ||
                statusName !== NotesStatuses.registrating) &&
            (note.signatoryId !== user.id ||
                statusName !== NotesStatuses.signing) &&
            (note.approverId !== user.id ||
                statusName !== NotesStatuses.approving)
        )
            throw new ForbiddenException();

        if (!(data.comment || note.comment)) throw new BadRequestException();

        const updatedNote = await this.update(id, user.id, {
            ...data,
            status: NotesStatuses.revising,
        });
        await this.deleteNoteHistory(id);
        return updatedNote;
    }

    remove(id: string) {
        return this.prisma.note.delete({ where: { id }, select: { id: true } });
    }

    findNoteHistory(id: string) {
        return this.prisma.noteHistory.findMany({
            where: { noteId: id },
            include: {
                status: true,
            },
        });
    }

    private async noteHistoryAlreadyIncludeStatus(
        noteId: string,
        status: NotesStatuses,
    ) {
        const noteHistories = await this.findNoteHistory(noteId);
        return noteHistories
            .map((noteHistory) => noteHistory.status.name)
            .includes(status);
    }

    private createNoteHistory({
        status,
        userId,
        noteId,
    }: CreateNoteHistoryDto) {
        return this.prisma.noteHistory.create({
            data: {
                status: { connect: { name: status } },
                userAsChangedBy: { connect: { id: userId } },
                note: { connect: { id: noteId } },
            },
        });
    }

    private deleteNoteHistory(id: string) {
        return this.prisma.noteHistory.deleteMany({
            where: {
                noteId: id,
            },
        });
    }

    private async getConnectObj(connectingUserName: string, field: string) {
        if (!connectingUserName) return undefined;
        const role = RoleEnum[field];

        const userHasRole = await this.userService.checkUserHasRole(
            connectingUserName,
            role,
        );

        if (!userHasRole) {
            throw new BadRequestException(
                `Пользователь с именем ${connectingUserName} не имеет соответствующей роли (${role})`,
            );
        }
        return {
            [field]: { connect: { username: connectingUserName } },
        };
    }

    private async getConnectObjsUpdateCreateFlow(data: IUsersConnectFields) {
        const connectFieldsKeys: (keyof IUsersConnectFields)[] = [
            'executor',
            'approver',
            'signatory',
            'registrar',
        ];
        const connectArray = await Promise.all(
            connectFieldsKeys.map(async (field) => {
                const username = data[field];
                if (username) {
                    return this.getConnectObj(username, field);
                }
                return null;
            }),
        );
        const objFromArray = await connectArray.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});
        return objFromArray;
    }
}
