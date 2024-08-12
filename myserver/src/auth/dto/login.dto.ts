import { MAX_EMAIL_LENGTH } from "@user/user.constants"
import { IsString, MaxLength, MinLength } from "class-validator"

export class LoginDto {
    @IsString()
    @MaxLength(MAX_EMAIL_LENGTH)
    login: string

    @IsString()
    @MinLength(8)
    password: string
}