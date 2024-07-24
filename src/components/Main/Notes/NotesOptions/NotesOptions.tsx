import { FC } from "react";

import s from "./NotesOptions.module.scss";
import { NotesOptionsBtns } from "./NotesOptionsBtns/NotesOptionsBtns";
import { NotesOptionsFormModal } from "./NotesOptionsFormModal/NotesOptionsFormModal";

export const NotesOptions: FC = () => {
    return (
        <div className={s.notesOptions}>
            <NotesOptionsBtns />
            <NotesOptionsFormModal/>
        </div>
    );
};
