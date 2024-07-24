import { NotesStatuses } from "../../../utils/notes-statuses";
import s from "./Notes.module.scss";

export const getStatusClass = (status: NotesStatuses | null | undefined) => {
    switch (status) {
        case NotesStatuses.CREATED:
        case NotesStatuses.REVISING:
            return s["notes-status--gray"];
        case NotesStatuses.APPROVING:
        case NotesStatuses.SIGNING:
        case NotesStatuses.REGISTRATING:
            return s["notes-status--blue"];
        case NotesStatuses.REGISTERED:
            return s["notes-status--green"];
        case NotesStatuses.APPROVED:
        case NotesStatuses.SIGNED:
            return s["notes-status--orange"];
        default:
            return "";
    }
};

