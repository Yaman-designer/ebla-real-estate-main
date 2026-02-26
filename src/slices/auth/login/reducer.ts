import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  error: "", // for error message
  loading: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    apiError(state, action) {
      // Ensure error is a string
      let errorMessage = "An error occurred";
      if (typeof action.payload === 'string') {
        errorMessage = action.payload;
      } else if (action.payload?.data) {
        errorMessage = typeof action.payload.data === 'string' ? action.payload.data : JSON.stringify(action.payload.data);
      } else if (action.payload?.message) {
        errorMessage = action.payload.message;
      } else if (action.payload) {
        try {
          errorMessage = JSON.stringify(action.payload);
        } catch (e) {
          errorMessage = "Unknown error";
        }
      }

      state.error = errorMessage;
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_login_flag(state) {
      state.error = ""
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;