import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { Note, NoteData } from "../../types/notes.types";
import { NotesStatuses } from "../../utils/notes-statuses";
import { SubmitButtons } from "../../components/Main/Notes/NotesOptions/NotesOptionsFormModal/NotesOptionsForm/NotesOptionsForm";

const initialNotes: Note[] = [
    {
        id: uuidv4(),
        number: 1,
        createdAt: "22.01.2021",
        status: NotesStatuses.SIGNING as NotesStatuses | null,
        executor: "Vladislav_e",
        signatory: "pavel3",
        approver: "Maria_v",
        registrar: "reg_anton",
        to_whom: "eugene1",
        reg_date: "19.07.2021",
        reg_num: "08/1",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 2,
        createdAt: "01.09.2020",
        status: NotesStatuses.SIGNED as NotesStatuses | null,
        executor: "stanislav",
        signatory: "vladimir27",
        approver: "dmitriyn",
        registrar: "alexey",
        to_whom: "Maria_v",
        reg_date: "17.10.2020",
        reg_num: "09/1",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 3,
        createdAt: "22.04.2024",
        status: NotesStatuses.REVISING as NotesStatuses | null,
        executor: "ollleg",
        signatory: "varvara",
        approver: "pavel100",
        registrar: "valeriy",
        to_whom: "viktorr",
        reg_date: "23.04.2024",
        reg_num: "08/3",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 4,
        createdAt: "22.01.2021",
        status: NotesStatuses.CREATED as NotesStatuses | null,
        executor: "Vladislav_e",
        signatory: "pavel3",
        approver: "Maria_v",
        registrar: "reg_anton",
        to_whom: "eugene1",
        reg_date: "19.07.2021",
        reg_num: "08/1",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 5,
        createdAt: "01.09.2020",
        status: NotesStatuses.REGISTERED as NotesStatuses | null,
        executor: "stanislav",
        signatory: "vladimir27",
        approver: "dmitriyn",
        registrar: "alexey",
        to_whom: "Maria_v",
        reg_date: "17.10.2020",
        reg_num: "09/1",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 6,
        createdAt: "22.04.2024",
        status: NotesStatuses.APPROVING as NotesStatuses | null,
        executor: "ollleg",
        signatory: "varvara",
        approver: "pavel100",
        registrar: "valeriy",
        to_whom: "viktorr",
        reg_date: "23.04.2024",
        reg_num: "08/3",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 7,
        createdAt: "22.04.2024",
        status: NotesStatuses.APPROVING as NotesStatuses | null,
        executor: "ollleg",
        signatory: "",
        approver: "pavel100",
        registrar: "valeriy",
        to_whom: "viktorr",
        reg_date: "23.04.2024",
        reg_num: "08/3",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 8,
        createdAt: "22.04.2024",
        status: NotesStatuses.REGISTRATING as NotesStatuses | null,
        executor: "ollleg",
        signatory: "varvara",
        approver: "pavel100",
        registrar: "valeriy",
        to_whom: "viktorr",
        reg_date: "23.04.2024",
        reg_num: "08/3",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
    {
        id: uuidv4(),
        number: 9,
        createdAt: "22.04.2024",
        status: NotesStatuses.APPROVED as NotesStatuses | null,
        executor: "ollleg",
        signatory: "varvara",
        approver: "pavel100",
        registrar: "valeriy",
        to_whom: "viktorr",
        reg_date: "23.04.2024",
        reg_num: "08/3",
        summary: "заметка",
        desc: "sdfsdfsdfsdfsdf",
        comment: "sdfsdfsdfsdfsdf",
    },
];
const initialState = {
    notesOptionsEditMode: false,
    showOptionForm: false,
    selectedNote: {} as Note,
    currentPage: 1,
    perPage: 5,
    submitBtnClicked: "" as SubmitButtons,
    notes: initialNotes,
    currentNotes: [] as Note[],
};

export const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        toggleShowOptionForm: (state) => {
            state.showOptionForm = !state.showOptionForm;
        },
        setNotesOptionsEditMode: (state, action: PayloadAction<boolean>) => {
            state.notesOptionsEditMode = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setSelectedNote: (state, action: PayloadAction<Note>) => {
            state.selectedNote = action.payload;
        },
        setCurrentNotes: (state, action: PayloadAction<number>) => {
            const currentPage = action.payload;
            const perPage = state.perPage;

            const startIndex = (currentPage - 1) * perPage;
            const endIndex = startIndex + perPage;

            state.currentNotes = state.notes.slice(startIndex, endIndex);
        },
        addNote: (state, action: PayloadAction<NoteData>) => {
            state.notes.push({ id: uuidv4(), ...action.payload });
        },
        editNote: (state, action: PayloadAction<NoteData>) => {
            const noteIndex = state.notes.findIndex(
                (note) => note.id === state.selectedNote.id
            );
            if (noteIndex === -1) return;

            const newNote = {
                ...state.selectedNote,
                ...action.payload,
            };
            state.notes[noteIndex] = newNote;
            state.selectedNote = newNote;
        },
        deleteNote: (state) => {
            state.notes = state.notes.filter(
                (note) => note.id !== state.selectedNote.id
            );

            // Пересчет номеров оставшихся заметок
            state.notes.forEach((note, index) => {
                note.number = index + 1;
            });

            state.selectedNote = {} as Note;
        },
        setSubmitBtnClicked: (state, action: PayloadAction<SubmitButtons>) => {
            state.submitBtnClicked = action.payload;
        },
    },
});

export default notesSlice.reducer;
