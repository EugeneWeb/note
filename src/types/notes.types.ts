import { NotesStatuses } from "../utils/notes-statuses";

export type Note = {
    id: string;
    number: number;
    createdAt: string;
    status: NotesStatuses | null;
    executor: string;
    signatory: string;
    approver: string;
    registrar: string;
    to_whom: string;
    reg_date: string | undefined;
    reg_num: string;
    summary: string;
    desc: string;
    comment: string;
}
export type NoteData = Omit<Note, "id">

