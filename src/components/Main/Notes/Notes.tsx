import { NotesList } from './NotesList/NotesList';
import { NotesOptions } from './NotesOptions/NotesOptions';


export const Notes = () => {
    return (
        <div>
            <NotesOptions />
            <NotesList />
        </div>
    );
};
