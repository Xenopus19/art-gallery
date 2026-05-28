import { createSlice, type PayloadAction, type UnknownAction } from "@reduxjs/toolkit";

interface MessageState {
  message: string;
  details: string;
  isError: boolean;
}

const initialState: MessageState = {
  message: "",
  details: "",
  isError: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (_, action: PayloadAction<MessageState>) => {
      return action.payload;
    },
    resetMessage: () => {
      return initialState;
    },
  },
});

export const { setMessage, resetMessage } = messageSlice.actions;

export const makeMessage = (message: string, isError = false, details = "") => {
  return (dispatch: (action: UnknownAction) => void) => {
    dispatch(setMessage({ message, details, isError }));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 7000);
  };
};

export default messageSlice.reducer;
