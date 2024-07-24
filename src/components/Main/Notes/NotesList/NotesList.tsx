import { FC, useEffect } from "react";

import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useActions } from "../../../../hooks/useActions";
import { Paginator } from "../../../common/Paginator/Paginator";
import {NotesListTable} from "./NotesListTable/NotesListTable";
import s from "./NotesList.module.scss";

export const NotesList: FC = () => {
    const { perPage, currentPage, notes} = useAppSelector(
        (state) => state.notes
    );
    const { setCurrentNotes, setCurrentPage } = useActions();

    useEffect(() => {
        setCurrentNotes(1);
    }, [setCurrentNotes]);
    useEffect(() => {
        setCurrentNotes(currentPage);
    }, [notes, setCurrentNotes, currentPage]);

    const onChangePage = (pageNum: number) => {
        setCurrentNotes(pageNum);
        setCurrentPage(pageNum);
    };
    return (
        <div>
            <div className={s.notesList__right}>
                <Paginator
                    totalItemsCount={notes.length}
                    perPage={perPage}
                    currentPage={currentPage}
                    onChangePage={onChangePage}
                />
            </div>
            <NotesListTable />
        </div>
    );
};
