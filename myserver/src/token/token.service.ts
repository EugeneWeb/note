import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { add } from 'date-fns';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { REFRESH_TOKEN } from './token.constants';
import { ConfigService } from '@nestjs/config';
import { ITokens } from './interfaces';
import { ConfigEnum } from 'src/config-enum';
import { IUserWithRoles } from '@user/interfaces';
import { getRolesNamesArray } from '@common/helpers/get-roles-names-array';

@Injectable()
export class TokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ){}
    private readonly logger = new Logger(TokenService.name);

    deleteRefreshToken(refreshToken: string) {
        return this.prisma.token.delete({ where: { token: refreshToken } });
    }

    async refreshTokens(
        refreshToken: string,
        userAgent: string,
    ): Promise<ITokens> {
        const token = await this.prisma.token.delete({
            where: { token: refreshToken },
        });
        if (!token || new Date(token.exp) < new Date())
            throw new UnauthorizedException();

        const user = await this.userService.findById(token.userId).catch((err) => {
            this.logger.error(err);
            return null;
        });
        return this.generateTokens(user, userAgent);
    }

    async generateTokens(user: IUserWithRoles, userAgent: string) {
        const rolesArray = getRolesNamesArray(user.roles)
        const accessToken =
            'Bearer ' +
            await this.jwtService.signAsync({
                id: user.id,
                email: user.email,
                roles: rolesArray
            });
        const refreshToken = await this.getRefreshToken(user.id, userAgent);
        return {
            accessToken,
            refreshToken,
        };
    }

    private async getRefreshToken(userId: string, userAgent: string) {
        const _token = await this.prisma.token.findFirst({
            where: { userId, userAgent },
        });

        const createUpdateData = {
            exp: add(new Date(), { months: 1 }),
        };

        const token = _token?.token ?? '';
        return this.prisma.token.upsert({
            where: { token },
            update: {
                ...createUpdateData,
            },
            create: {
                ...createUpdateData,
                userId,
                userAgent,
            },
        });
    }

    setRefreshTokenToCookies(tokens: ITokens, res: Response) {
        if (!tokens) throw new UnauthorizedException();
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure:
                this.config.get<string>(ConfigEnum.NODE_ENV, 'development') ===
                'production',
            path: '/',
        });
        res.status(HttpStatus.CREATED).json({
            accessToken: tokens.accessToken,
        });
    }
}
