import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      console.log(action.payload);
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateProfileStart: (state) => {
      state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
      console.log(action.payload);
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProfileFailure: (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} = userSlice.actions;

export default userSlice.reducer;
