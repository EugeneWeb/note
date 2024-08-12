import { Module } from '@nestjs/common';
import { RoleService } from '@role/role.service';
import { TokenModule } from '@token/token.module';
import { UserModule } from '@user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [PrismaModule, UserModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService, RoleService],
})
export class AuthModule {}
