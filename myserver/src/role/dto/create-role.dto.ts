import { MaxLength } from "class-validator";

export class CreateRoleDto {
    @MaxLength(64)
    name: string
}