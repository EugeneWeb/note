import { IJwtPayload } from '@auth/interfaces';
import { getRolesNamesArray } from '@common/helpers/get-roles-names-array';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoleEnum } from '@role/role-enum';
import { genSalt, hash } from 'bcrypt';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserWithRoles } from './interfaces';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async findByLogin(login: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: login }, { username: login }],
            },
            include: {
                roles: true,
            },
        });
        if (!user)
            throw new NotFoundException(
                `Пользователь с именем ${login} не существует`,
            );
        await this.cacheManager.set(user.id, user);
        return user;
    }

    async findById(id: string) {
        const user = await this.cacheManager.get<IUserWithRoles>(id);
        if (!user) {
            const dbUser = await this.prisma.user.findUnique({
                where: { id },
                include: {
                    roles: true,
                },
            });
            if (!dbUser) return null;

            await this.cacheManager.set(id, dbUser);
            return dbUser;
        }
        return user;
    }
    async findUserNamesByRole(role: RoleEnum) {
        const {data:users} = await this.findAll({role})
        return users.map(user => user.username)
    }

    async findAll({ search, role }: FilterUserDto) {
        let where: Prisma.UserWhereInput = {};

        if (search) {
            where.email = { contains: search, mode: 'insensitive' };
        }
        if (role) {
            where.roles = {
                some: { name: role },
            };
        }

        const users = await this.prisma.user.findMany({
            where,
            include: {
                roles: true,
            },
        });

        const totalUsers = await this.prisma.user.count({ where });

        return {
            data: users,
            total: totalUsers,
        };
    }

    async create(user: CreateUserDto) {
        const hashedPassword = await this.hashPassword(user.password);

        const newUser = await this.prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: hashedPassword,
                roles: {
                    connect: {
                        name: RoleEnum.user,
                    },
                },
            },
            include: {
                roles: true,
            },
        });
        await this.cacheManager.set(newUser.id, newUser);
        return newUser;
    }

    async update(id: string, { roles, ...data }: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                roles: roles?.length && {
                    connect: roles.map((roleName) => ({
                        name: roleName,
                    })),
                },
            },
            include: {
                roles: true,
            },
        });
        await this.cacheManager.set(id, user);
        return user;
    }

    async delete(id: string, user: IJwtPayload) {
        if (user.id !== id && !user.roles.includes(RoleEnum.admin))
            return new ForbiddenException();
        await this.cacheManager.del(id);

        return this.prisma.user.delete({ where: { id }, select: { id: true } });
    }

    async checkUserHasRole(login: string, role: RoleEnum) {
        const user = await this.findByLogin(login);
        return getRolesNamesArray(user.roles).includes(role);
    }

    private async hashPassword(password: string) {
        const salt = await genSalt(10);
        return hash(password, salt);
    }
}
