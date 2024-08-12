import { Public } from '@common/decorators/public.decorator';
import { ParseCuidPipe } from '@common/pipes/parse-cuid.pipe';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { RolesGuard } from '@token/guards/roles.guard';
import { RoleEnum } from './role-enum';
import { Roles } from '@common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Roles(RoleEnum.admin)
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @UsePipes(new ValidationPipe())
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    remove(@Param('id', ParseCuidPipe) id: string) {
        return this.roleService.remove(id);
    }
}
