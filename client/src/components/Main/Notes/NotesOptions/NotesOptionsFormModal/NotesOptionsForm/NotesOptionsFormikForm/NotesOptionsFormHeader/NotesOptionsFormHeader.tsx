import { FC } from "react";

import { cls } from "../../../../../../../../utils/helpers";
import { NotesStatuses } from "../../../../../../../../utils/notes-statuses";
import { getStatusClass } from "../../../../../helpers";
import s from "./NotesOptionsFormHeader.module.scss";

interface INotesOptionsFormHeader {
    number: number;
    status: NotesStatuses | null;
    notesOptionsEditMode: boolean;
    isReadOnly: boolean;
}
export const NotesOptionsFormHeader: FC<INotesOptionsFormHeader> = ({
    notesOptionsEditMode,
    number,
    status,
    isReadOnly,
}) => {
    return (
        <>
            <h2 className={s.title}>
                Служебная записка № {number}
                {isReadOnly && (
                    <span className={s.readOnly}>&nbsp;(Режим чтения)</span>
                )}
            </h2>
            <p className={cls([getStatusClass(status), s.noteStatus])}>
                {notesOptionsEditMode ? status : "Создается"}
            </p>
        </>
    );
};
