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
import { CreateNoteStatusDto } from './dto/create-note-status.dto';
import { NoteStatusService } from './note-status.service';
import { ParseCuidPipe } from '@common/pipes/parse-cuid.pipe';
import { RolesGuard } from '@token/guards/roles.guard';
import { RoleEnum } from '@role/role-enum';
import { Roles } from '@common/decorators/roles.decorator';


@Controller('note-status')
export class NoteStatusController {
    constructor(private readonly noteStatusService: NoteStatusService) {}

    @UsePipes(new ValidationPipe())
    @Post()
    create(@Body() createRoleDto: CreateNoteStatusDto) {
        return this.noteStatusService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.noteStatusService.findAll();
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    remove(@Param('id', ParseCuidPipe) id: string) {
        return this.noteStatusService.remove(id);
    }
}
