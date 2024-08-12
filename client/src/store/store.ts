import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/auth.slice";
import reducerNotes from "./reducers/notes.slice";

const rootReducer = combineReducers({
    auth: authReducer,
    notes: reducerNotes,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
