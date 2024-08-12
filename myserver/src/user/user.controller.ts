import { IJwtPayload } from '@auth/interfaces';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ParseCuidPipe } from '@common/pipes/parse-cuid.pipe';
import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { RoleEnum } from '@role/role-enum';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './responses/user.response';
import { UserService } from './user.service';
import { RolesGuard } from '@token/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(RolesGuard)
    @Roles(RoleEnum.admin)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe())
    @Get()
    async getUsers(
        @Query('search') search?: string,
        @Query('role') role?: RoleEnum,
    ) {
        const users = await this.userService.findAll({ search, role });

        return {
            ...users,
            data: plainToInstance(UserResponse, users.data),
        };
    }

    @Get('names')
    findUserNamesByRole(@Query('role') role: RoleEnum) {
        if(!role || role === RoleEnum.admin || role === RoleEnum.user) throw new BadRequestException("Указана неверная роль")
        return this.userService.findUserNamesByRole(role);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe())
    @Get(':id')
    async findOne(@Param('id', ParseCuidPipe) id: string) {
        const user = await this.userService.findById(id);
        if (!user) throw new NotFoundException();
        return new UserResponse(user);
    }

    @UseGuards(RolesGuard)
    @Roles(RoleEnum.admin)
    @Delete(':id')
    async delete(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: IJwtPayload,
    ) {
        return this.userService.delete(id, user);
    }

    @UseGuards(RolesGuard)
    @Roles(RoleEnum.admin)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async update(
        @Body() body: UpdateUserDto,
        @Param('id', ParseCuidPipe) id: string,
    ) {
        const user = await this.userService.findById(id);
        if (!user) throw new NotFoundException();
        const updatedUser = await this.userService.update(id, body);
        return new UserResponse(updatedUser);
    }
}
