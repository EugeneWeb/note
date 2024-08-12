import { Cookie } from '@common/decorators/cookies.decorator';
import { Public } from '@common/decorators/public.decorator';
import { UserAgent } from '@common/decorators/user-agent.decorator';
import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserResponse } from '@user/responses/user.response';
import { Response } from 'express';
import { REFRESH_TOKEN } from '@token/token.constants';
import { TokenService } from '@token/token.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@user/user.service';
import { Roles } from '@common/decorators/roles.decorator';
import { RoleEnum } from '@role/role-enum';
import { RolesGuard } from '@token/guards/roles.guard';


@Controller('auth')
//10 запросов в 5 минут
@Throttle({ default: { limit: 10, ttl: 300000 } })
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    @Public()
    @Get('logout')
    async logout(
        @Cookie(REFRESH_TOKEN) refreshToken: string | null,
        @Res() res: Response,
    ) {
        if (!refreshToken) {
            res.sendStatus(HttpStatus.OK);
            return;
        }
        await this.tokenService.deleteRefreshToken(refreshToken);
        res.clearCookie(REFRESH_TOKEN, {
            httpOnly: true,
            secure: true,
            expires: new Date(),
        });
        res.sendStatus(HttpStatus.OK);
    }

    @UseGuards(RolesGuard)
    @Roles(RoleEnum.admin)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.userService.create(dto);
        if (!user)
            throw new BadRequestException(
                `Не удалось зарегистрировать пользователя с данными\n${JSON.stringify(dto)}`,
            );
        return new UserResponse(user);
    }

    @Public()
    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res() res: Response,
        @UserAgent() UserAgent: string,
    ) {
        const tokens = await this.authService.login(dto, UserAgent);
        if (!tokens)
            throw new BadRequestException(
                `Не удалось войти с данными\n${JSON.stringify(dto)}`,
            );

        this.tokenService.setRefreshTokenToCookies(tokens, res);
    }
}
