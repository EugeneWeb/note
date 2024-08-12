import React, { FC } from "react";
import s from "./NotesOptionsFormModal.module.scss";

import { NotesOptionsForm } from "./NotesOptionsForm/NotesOptionsForm";
import { cls } from "../../../../../utils/helpers";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useActions } from "../../../../../hooks/useActions";


export const NotesOptionsFormModal: FC = () => { 
    const showOptionForm = useAppSelector(
        (state) => state.notes.showOptionForm
    );
    const {toggleShowOptionForm} = useActions()

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            toggleShowOptionForm();
        }
    };
    
    return (
        <div
            className={cls([s.overlay, showOptionForm && s["overlay--show"]])}
            onClick={handleOverlayClick}
        >
            <NotesOptionsForm />
        </div>
    );
};

