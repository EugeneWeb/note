import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    imports: [PrismaModule],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
