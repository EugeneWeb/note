import { MAX_USERNAME_LENGTH } from '@user/user.constants';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
    @IsString()
    @IsOptional()
    summary?: string;

    @IsString()
    @IsOptional()
    desc?: string;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsString()
    @MaxLength(MAX_USERNAME_LENGTH)
    @IsOptional()
    signatory?: string;

    @IsString()
    @MaxLength(MAX_USERNAME_LENGTH)
    @IsOptional()
    executor?: string;

    @IsString()
    @MaxLength(MAX_USERNAME_LENGTH)
    @IsOptional()
    approver?: string;

    @IsString()
    @MaxLength(MAX_USERNAME_LENGTH)
    @IsOptional()
    registrar?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    recipient?: string;
}
