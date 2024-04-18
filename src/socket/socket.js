import { io } from "socket.io-client";
import { store } from "../store/store";
import { setElements, updateElement } from "../whiteboard/whiteboardSlice";
import {
  removeCursorPosition,
  updateCursorPosition,
} from "../cursorOverlay/cursorSlice";

let socket;

let SERVER_URI = process.env.SERVER_URI || "http://localhost:4500";

export const connectWithSocketServer = () => {
  socket = io(SERVER_URI);

  socket.on("connect", () => {
    console.log("Connected to socket.io server");
    console.log("socket.id", socket.id);
  });

  socket.on("whiteboard-state", (elements) => {
    store.dispatch(setElements(elements));
  });

  socket.on("element-update", (elementData) => {
    store.dispatch(updateElement(elementData));
  });

  socket.on("whiteboard-clear", () => {
    store.dispatch(setElements([]));
  });

  socket.on("cursor-position", (cursorData) => {
    store.dispatch(updateCursorPosition(cursorData));
  });

  socket.on("user-disconnected", (disconnectedUserId) => {
    store.dispatch(removeCursorPosition(disconnectedUserId));
  });
};

export const emitElementUpdate = (elementData) => {
  socket.emit("element-update", elementData);
};

export const emitClearWhiteboard = () => {
  socket.emit("whiteboard-clear");
};

export const emitCursorPosition = (cursorData) => {
  socket.emit("cursor-position", cursorData);
};
