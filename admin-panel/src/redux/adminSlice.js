// admin slice

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
      loginSuccess: (state, action) => {
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      },
      loginFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      },
      logout: (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false; // Make sure to reset loading here
      },
      setLoading: (state) => {
        state.loading = true;
      },
      loadAdminSuccess: (state, action) => {
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.loading = false; // Set loading to false after success
      },
    },
  });

export const {
  loginSuccess,
  loginFailure,
  logout,
  setLoading,
  loadAdminSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
