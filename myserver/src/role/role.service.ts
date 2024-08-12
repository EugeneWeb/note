import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService) {}

    create(data: CreateRoleDto) {
        return this.prisma.role.create({ data });
    }

    findAll() {
        return this.prisma.role.findMany();
    }

    remove(id: string) {
        return this.prisma.role.delete({ where: { id } });
    }
}
