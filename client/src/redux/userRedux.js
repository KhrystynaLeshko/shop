import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  isFetching: false,
  error: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      loginStart: (state) => {
        state.isFetching = true;
      },
      loginSuccess: (state, action) => {
        state.isFetching = false;
        state.currentUser = action.payload;
      },
      loginFailure: (state) => {
        state.isFetching = false;
        state.error = true;
      },
      logout: (state) => {
        state.user = null;
        state.isFetching = false;
        state.error = false
      },
      // Clear the entire Redux store when LOGOUT by dispatching a special action that resets the store to its initial state.
      resetUser: (state) => {
        state.currentUser = initialState.currentUser;
        state.isFetching = initialState.isFetching;
        state.error = initialState.error;
      }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, resetUser } = userSlice.actions;
export default userSlice.reducer;