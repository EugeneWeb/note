import { Module } from '@nestjs/common';
import { NoteStatusService } from './note-status.service';
import { NoteStatusController } from './note-status.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [NoteStatusController],
  providers: [NoteStatusService],
})
export class NoteStatusModule {}
