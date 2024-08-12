import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ITokens } from '@token/interfaces';
import { TokenService } from '@token/token.service';
import { UserService } from '@user/user.service';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    private readonly logger = new Logger(AuthService.name);

    async login(dto: LoginDto, userAgent: string): Promise<ITokens> {
        const user = await this.userService
            .findByLogin(dto.login)
            .catch((err) => {
                this.logger.error(err);
                return null;
            });

        const cmpPass =
            user?.password && (await compare(dto.password, user.password));
        if (!user || !cmpPass) {
            throw new UnauthorizedException('Не верный логин или пароль');
        }
        return this.tokenService.generateTokens(user, userAgent);
    }
}
