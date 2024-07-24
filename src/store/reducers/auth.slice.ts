import { createSlice } from "@reduxjs/toolkit";

import { User } from "../../types/user.types";

const initialState = {
    currentUser: {} as User,
    isAuth: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser: (state) => {
            state.isAuth = true;
            state.currentUser = {
                login: 'user',
                role: "executor",
                iconPath: '/somePath'
            }
        },
    }
})

export default authSlice.reducer
