import s from "./NotesListTable.module.scss";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { Note } from "../../../../../types/notes.types";
import { NotesListElement } from "../NotesListElement/NotesListElement";

export const NotesListTable = () => {
    const { currentNotes } = useAppSelector((state) => state.notes);

    //Добавление в таблицу пустых строк
    const minLength = 5;
    const notesCopy: Array<Note | null> = [...currentNotes];
    while (notesCopy.length < minLength) notesCopy.push(null);

    return (
        <table className={s.table}>
            <thead>
                <tr>
                    <th>Номер</th>
                    <th>Дата создания</th>
                    <th>Статус</th>
                    <th>Исполнитель</th>
                    <th>Подписант</th>
                    <th>Согласующий</th>
                    <th>Регистратор</th>
                    <th>Рег. дата</th>
                    <th>Рег. номер</th>
                </tr>
            </thead>
            <tbody>
                {notesCopy.map((item, index) => (
                    <NotesListElement
                        key={item ? item.id : `empty-${index}`}
                        note={item}
                    />
                ))}
            </tbody>
        </table>
    );
};
