import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RoleService } from '@role/role.service';
import { UserModule } from '@user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { options } from './config/jwt-module-async-options';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategies';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        PassportModule,
        JwtModule.registerAsync(options()),
    ],
    controllers: [TokenController],
    providers: [TokenService, ...STRATEGIES, ...GUARDS],
    exports: [TokenService],
})
export class TokenModule {}
