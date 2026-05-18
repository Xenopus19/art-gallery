import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

interface UserState {
  data: User | null; 
}

const initialState: UserState = {
  data: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    resetUser: (state) => {
      state.data = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
