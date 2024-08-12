import { convertToSecondsUtil } from '@common/utils/convert-to-seconds.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigEnum } from 'src/config-enum';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        PrismaModule,
        CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ttl:
                    convertToSecondsUtil(config.get(ConfigEnum.JWT_EXP)) * 1000,
            }),
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
