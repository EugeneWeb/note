import { authSlice } from "./auth.slice";
import { notesSlice } from "./notes.slice";

export const rootActions = {
    ...authSlice.actions,
    ...notesSlice.actions,
};
