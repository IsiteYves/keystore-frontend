import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

const { actions: userActions, reducer: userReducer } = userSlice;

export { userActions, userReducer };
