import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from '@user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
