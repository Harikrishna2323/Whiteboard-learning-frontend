import React from "react";
import Whiteboard from "./whiteboard/Whiteboard";
import { connectWithSocketServer } from "./socket/socket";
import CursorOverlay from "./cursorOverlay/CursorOverlay";

function App() {
  React.useEffect(() => {
    connectWithSocketServer();
  }, []);

  return (
    <div>
      <Whiteboard />
      <CursorOverlay />
    </div>
  );
}

export default App;
