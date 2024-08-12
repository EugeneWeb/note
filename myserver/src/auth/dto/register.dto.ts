import { IsPasswordsMatchingConstraint } from "@common/decorators/is-passwords-matching-constraint"
import { MAX_EMAIL_LENGTH, MAX_USERNAME_LENGTH } from "@user/user.constants"
import { IsEmail, IsString, MaxLength, MinLength, Validate } from "class-validator"

export class RegisterDto {
    @IsString()
    @MaxLength(MAX_USERNAME_LENGTH)
    username: string

    @IsEmail()
    @MaxLength(MAX_EMAIL_LENGTH)
    email: string

    @IsString()
    @MaxLength(32)
    @MinLength(8)
    password: string

    @IsString()
    @MaxLength(32)
    @MinLength(8)
    @Validate(IsPasswordsMatchingConstraint)
    passwordRepeat: string
}