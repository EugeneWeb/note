import { FC } from "react";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useActions } from "../../../../../hooks/useActions";
import s from "./NotesOptionsBtns.module.scss";

export const NotesOptionsBtns: FC = () => {
    const selectedNote = useAppSelector((state) => state.notes.selectedNote);
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const { setNotesOptionsEditMode, deleteNote, toggleShowOptionForm } = useActions();

    const handleEditCreateClick = (editMode: boolean) => {
        setNotesOptionsEditMode(editMode);
        toggleShowOptionForm();
    };
    const handleDeleteClick = () => {
        deleteNote();
    };

    const isNoteSelected = Object.keys(selectedNote).length > 0;
    const isExecutor = currentUser.role === "executor";
    return (
        <>
            <button
                disabled={!isExecutor}
                className={s.option}
                onClick={() => handleEditCreateClick(false)}
            >
                Создать
            </button>
            <button
                disabled={!isNoteSelected}
                className={s.option}
                onClick={() => handleEditCreateClick(true)}
            >
                Редактировать
            </button>
            <button
                disabled={!isNoteSelected}
                className={s.option}
                onClick={handleDeleteClick}
            >
                Удалить
            </button>
        </>
    );
};
