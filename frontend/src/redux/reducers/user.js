import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,

}

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
            state.role = action.payload.role;
        })
        .addCase("LoadUserFail", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("ClearErrors", (state) => {
            state.error = null;
        });
});
