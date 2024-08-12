import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '@auth/interfaces';
import { UserService } from '@user/user.service';
import { User } from '@prisma/client';
import { ConfigEnum } from 'src/config-enum';
import { IUserWithRoles } from '@user/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        private readonly config: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get(ConfigEnum.JWT_SECRET),
        });
    }

    async validate(payload: IJwtPayload) {
        const user: IUserWithRoles = await this.userService.findById(payload.id).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (!user || user?.isBlocked) throw new UnauthorizedException(user?.isBlocked && "Вы были заблокированы. По вопросу разблокировки обращаться в техническую поддержку.");
        return payload;
    }
}
