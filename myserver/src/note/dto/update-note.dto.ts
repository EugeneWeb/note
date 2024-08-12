import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
    @IsDateString()
    @IsOptional()
    regDate?: Date;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    regNum?: string;

    @IsString()
    @MaxLength(64)
    @IsOptional()
    status?: string;
}
