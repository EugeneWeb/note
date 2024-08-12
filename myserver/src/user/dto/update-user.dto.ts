import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { RoleEnum } from "@role/role-enum";
import { MAX_EMAIL_LENGTH, MAX_USERNAME_LENGTH } from "@user/user.constants";

export class UpdateUserDto {
    @IsEmail()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsOptional()
    email?: string;

    @IsString()
    @MaxLength(MAX_USERNAME_LENGTH)
    @IsOptional()
    username?: string;

    @IsBoolean()
    @IsOptional()
    isBlocked?: boolean;

    @IsArray()
    @IsOptional()
    roles?: RoleEnum[];
}