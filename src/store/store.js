import {
  configureStore,
  // createSerializableStateInvariantMiddleware,
} from "@reduxjs/toolkit";

import whiteboardSliceReducer from "../whiteboard/whiteboardSlice";
import cursorSliceReducer from "../cursorOverlay/cursorSlice";

const ignoredActions = ["whiteboard/setElements"]; // Actions to ignore
const ignoredPaths = ["whiteboard.elements", "whiteboard.updateElement"]; // Paths to ignore
const ignoredActionPaths = [
  "whiteboard.elements",
  "whiteboard.roughElement.options.randomizer",
  "payload.roughElement.options.randomizer",
];
export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSliceReducer,
    cursor: cursorSliceReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions,
        ignoredPaths,
        ignoredActionPaths,
      },
    });
  },
});
