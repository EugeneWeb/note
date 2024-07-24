import { FC } from "react";

import s from './NotesListElement.module.scss'
import { useActions } from "../../../../../hooks/useActions";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { Note } from "../../../../../types/notes.types";
import { cls } from "../../../../../utils/helpers";
import { getStatusClass } from "../../helpers";

interface INotesListElement {
    note: Note | null
}
export const NotesListElement: FC<INotesListElement> = ({note}) => {
    const selectedNote = useAppSelector(state => state.notes.selectedNote)
    const { setSelectedNote} = useActions();

    const isSelected = note && note.id === selectedNote.id;
    return (
        <tr
            className={cls([
                s.row,
                note ? getStatusClass(note.status): s['row--empty'],
                isSelected && s["row--selected"]
            ])}
            onClick={() => note && setSelectedNote(note)}
        >
            <td>{note?.number || ''}</td>
            <td>{note?.createdAt}</td>
            <td>{note?.status}</td>
            <td>{note?.executor}</td>
            <td>{note?.signatory}</td>
            <td>{note?.approver}</td>
            <td>{note?.registrar}</td>
            <td>{note?.reg_date}</td>
            <td>{note?.reg_num}</td>
        </tr>
    );
}