import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { IJwtPayload } from '@auth/interfaces';
import { ParseCuidPipe } from '@common/pipes/parse-cuid.pipe';
import { RolesGuard } from '@token/guards/roles.guard';
import { RoleEnum } from '@role/role-enum';
import { Roles } from '@common/decorators/roles.decorator';
import { NotesStatuses } from 'src/note-status/note-status-enum';
import { ParsePositiveNumPipe } from '@common/pipes/parse-positive-int.pipe';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.executor)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto);
  }

  @UsePipes(new ValidationPipe())
  @Get()
  findAll(
    @Query('page', ParseIntPipe, ParsePositiveNumPipe) page: number,
    @Query('pageSize', ParseIntPipe, ParsePositiveNumPipe) pageSize: number,
    @CurrentUser() user: IJwtPayload
  ) {
    return this.noteService.findAll({page, pageSize}, user);
  }

  @UsePipes(new ValidationPipe())
  @Get('history/:id')
  findNoteHistory(@Param('id', ParseCuidPipe) id: string) {
    return this.noteService.findNoteHistory(id)
  }

  @Get(':id')
  findOne(@Param('id', ParseCuidPipe) id: string) {
    return this.noteService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.executor)
  @Patch('approval-submit/:id')
  submitForApproval(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.submitForApprovalRegistration(id, user, updateNoteDto, NotesStatuses.approving, 'approver')
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.executor)
  @Patch('registration-submit/:id')
  submitForRegistration(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.submitForApprovalRegistration(id, user, updateNoteDto, NotesStatuses.registrating, 'registrar')
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.approver)
  @Patch('approve/:id')
  approve(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.approve(id, updateNoteDto, user)
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.registrar)
  @Patch('register/:id')
  register(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.register(id, updateNoteDto, user)
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.signatory)
  @Patch('sign/:id')
  sign(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.sign(id, updateNoteDto, user)
  }

  @UsePipes(new ValidationPipe())
  @Patch('reject/:id')
  reject(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.reject(id, updateNoteDto, user)
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.admin)
  @Patch(':id')
  update(@Param('id', ParseCuidPipe) id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: IJwtPayload) {
    return this.noteService.update(id, user.id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseCuidPipe) id: string) {
    return this.noteService.remove(id);
  }

  
}
