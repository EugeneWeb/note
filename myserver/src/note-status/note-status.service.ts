import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateNoteStatusDto } from './dto/create-note-status.dto';

@Injectable()
export class NoteStatusService {
    constructor(private readonly prisma: PrismaService) {}

    create(data: CreateNoteStatusDto) {
        return this.prisma.noteStatus.create({ data });
    }

    findAll() {
        return this.prisma.noteStatus.findMany();
    }

    remove(id: string) {
        return this.prisma.noteStatus.delete({ where: { id } });
    }
}
