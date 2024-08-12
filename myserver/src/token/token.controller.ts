import { Cookie } from '@common/decorators/cookies.decorator';
import { Public } from '@common/decorators/public.decorator';
import { UserAgent } from '@common/decorators/user-agent.decorator';
import {
    BadRequestException,
    Controller,
    Get,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { REFRESH_TOKEN } from './token.constants';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}

    @Public()
    @Get('refresh')
    //10 запросов в 5 минут
    @Throttle({ default: { limit: 10, ttl: 300000 } })
    async refreshTokens(
        @Cookie(REFRESH_TOKEN) refreshToken: string | null,
        @Res() res: Response,
        @UserAgent() UserAgent: string,
    ) {
        if (!refreshToken) throw new UnauthorizedException();

        const token = await this.tokenService.refreshTokens(
            refreshToken,
            UserAgent,
        );
        if (!token) new BadRequestException('Не удалось обновить токены');
        this.tokenService.setRefreshTokenToCookies(token, res);
    }
}
