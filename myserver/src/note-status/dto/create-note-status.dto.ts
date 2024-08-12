import { MaxLength } from "class-validator";

export class CreateNoteStatusDto {
    @MaxLength(64)
    name: string
}
