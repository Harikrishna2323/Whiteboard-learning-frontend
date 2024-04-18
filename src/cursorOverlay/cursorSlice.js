import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  cursors: [],
};

const cursorSlice = createSlice({
  name: "cursor",
  initialState: INITIAL_STATE,
  reducers: {
    updateCursorPosition: (state, action) => {
      const { x, y, userId } = action.payload;

      const index = state.cursors.findIndex((c) => c.userId === userId);

      if (index !== -1) {
        state.cursors[index] = {
          userId,
          x,
          y,
        };
      } else {
        state.cursors.push({
          userId,
          x,
          y,
        });
      }
    },
    removeCursorPosition: (state, action) => {
      state.cursors = state.cursors.filter((c) => c.userId !== action.payload);
    },
  },
});

export const { updateCursorPosition, removeCursorPosition } =
  cursorSlice.actions;

export default cursorSlice.reducer;
