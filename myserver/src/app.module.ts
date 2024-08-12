import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'nestjs-prisma';
import { JwtAuthGuard } from '@token/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { NoteStatusModule } from './note-status/note-status.module';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                //100 запросов в минуту
                ttl: 60000,
                limit: 100,
            },
        ]),
        RoleModule,
        TokenModule,
        NoteModule,
        NoteStatusModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
