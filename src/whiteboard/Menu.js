import React from "react";
import reactangleIcon from "../resources/icons/rectangle.svg";
import lineIcon from "../resources/icons/line.svg";
import rubberIcon from "../resources/icons/rubber.svg";
import textIcon from "../resources/icons/text.svg";
import pencilIcon from "../resources/icons/pencil.svg";
import selectionIcon from "../resources/icons/selection.svg";
import { TOOL_TYPES } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setElements, setToolType } from "./whiteboardSlice";
import { emitClearWhiteboard } from "../socket/socket";

const IconButton = ({ src, type, isRubber }) => {
  const dispatch = useDispatch();

  const selectedToolType = useSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    dispatch(setToolType(type));
  };

  const handleClearCanvas = () => {
    dispatch(setElements([]));

    emitClearWhiteboard();
  };

  return (
    <button
      className={
        selectedToolType === type ? "menu_button_active" : "menu_button"
      }
      onClick={isRubber ? handleClearCanvas : handleToolChange}
    >
      <img src={src} width={"80%"} height={"80%"} alt="icon" />
    </button>
  );
};

const Menu = () => {
  return (
    <div className="menu_container">
      <IconButton src={reactangleIcon} type={TOOL_TYPES.RECTANGLE} />
      <IconButton src={lineIcon} type={TOOL_TYPES.LINE} />

      <IconButton src={rubberIcon} isRubber />

      <IconButton src={pencilIcon} type={TOOL_TYPES.PENCIL} />

      <IconButton src={textIcon} type={TOOL_TYPES.TEXT} />

      <IconButton src={selectionIcon} type={TOOL_TYPES.SELECTION} />
    </div>
  );
};

export default Menu;
