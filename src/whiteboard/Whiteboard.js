import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./Menu";
import rough from "roughjs/bundled/rough.esm";
import { CURSOR_POSITIONS, TOOL_TYPES, actions } from "../constants";
import {
  createElement,
  updateElement,
  drawElement,
  adjustmentRequired,
  adjustElementCoordinates,
  getElementAtPosition,
  getCursorForPosition,
  getResizedCoordinates,
  updatePencilElementWhenMoving,
} from "./utils";
import { v4 as uuid } from "uuid";
import { updateElement as updateElementInStore } from "./whiteboardSlice";
import { emitCursorPosition } from "../socket/socket";

let emitCursor = true;
let lastCursorPosition;

const Whiteboard = () => {
  const canvasRef = useRef();
  const textAreaRef = useRef();

  const toolType = useSelector((state) => state.whiteboard.tool);
  const dispatch = useDispatch();
  const [action, setAction] = useState(null);

  const [selectedElement, setSelectedElement] = useState(null);

  const elements = useSelector((state) => state.whiteboard.elements);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      drawElement({ roughCanvas, context: ctx, element });
    });
  }, [elements]);

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;

    if (selectedElement && action === actions.WRITING) {
      return;
    }

    switch (toolType) {
      case TOOL_TYPES.RECTANGLE:
      case TOOL_TYPES.LINE:
      case TOOL_TYPES.PENCIL: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
        });
        setAction(actions.DRAWING);

        setSelectedElement(element);

        dispatch(updateElementInStore(element));
        break;
      }

      case TOOL_TYPES.TEXT: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
        });
        setAction(actions.WRITING);

        setSelectedElement(element);

        dispatch(updateElementInStore(element));
        break;
      }

      case TOOL_TYPES.SELECTION: {
        const element = getElementAtPosition(clientX, clientY, elements);

        if (
          element &&
          (element.type === TOOL_TYPES.RECTANGLE ||
            element.type === TOOL_TYPES.TEXT ||
            element.type === TOOL_TYPES.LINE)
        ) {
          setAction(
            element.position === CURSOR_POSITIONS.INSIDE
              ? actions.MOVING
              : actions.RESIZING
          );

          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;

          setSelectedElement({ ...element, offsetX, offsetY });
        }

        if (element && element.type === TOOL_TYPES.PENCIL) {
          setAction(actions.MOVING);
          const offsetX = element.points.map((point) => clientX - point.x);
          const offsetY = element.points.map((point) => clientY - point.y);

          setSelectedElement({ ...element, offsetX, offsetY });
        }

        break;
      }

      default:
        setAction(null);
    }
  };

  const handleMouseUp = () => {
    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );

    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING || action === actions.RESIZING) {
        if (adjustmentRequired(elements[selectedElementIndex].type)) {
          const { x1, y1, x2, y2 } = adjustElementCoordinates(
            elements[selectedElementIndex]
          );

          updateElement(
            {
              index: selectedElementIndex,
              id: selectedElement.id,
              x1,
              x2,
              y1,
              y2,
              type: elements[selectedElementIndex].type,
            },
            elements
          );
        }
      }
    }

    setAction(null);
    setSelectedElement(null);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    lastCursorPosition = { x: clientX, y: clientY };

    if (emitCursor) {
      emitCursorPosition({ x: clientX, y: clientY });
      emitCursor = false;

      setTimeout(() => {
        emitCursor = true;
        emitCursorPosition(lastCursorPosition);
      }, [50]);
    }

    if (action === actions.DRAWING) {
      //find index of selected element
      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updateElement(
          {
            index,
            id: elements[index].id,
            x1: elements[index].x1,
            y1: elements[index].y1,
            x2: clientX,
            y2: clientY,
            type: elements[index].type,
          },
          elements
        );
      }
    }

    if (toolType === TOOL_TYPES.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);

      e.target.style.cursor = element
        ? getCursorForPosition(element.position)
        : "default";
    }

    if (
      selectedElement &&
      toolType === TOOL_TYPES.SELECTION &&
      action === actions.MOVING &&
      selectedElement.type === TOOL_TYPES.PENCIL
    ) {
      const newPoints = selectedElement.points.map((_, index) => ({
        x: clientX - selectedElement.offsetX[index],
        y: clientY - selectedElement.offsetY[index],
      }));

      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updatePencilElementWhenMoving({ index, newPoints }, elements);
      }

      return;
    }

    if (
      toolType === TOOL_TYPES.SELECTION &&
      action === actions.MOVING &&
      selectedElement
    ) {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY, text } =
        selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;

      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updateElement(
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index,
            text,
          },
          elements
        );
      }
    }

    if (
      toolType === TOOL_TYPES.SELECTION &&
      action === actions.RESIZING &&
      selectedElement
    ) {
      const { id, type, position, ...coordinates } = selectedElement;

      const { x1, y1, x2, y2 } = getResizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );

      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updateElement(
          {
            id: selectedElement.id,
            index,
            x1,
            y1,
            x2,
            y2,
            type: selectedElement.type,
          },
          elements
        );
      }
    }
  };

  const handleTextAreaBlur = (e) => {
    const { id, x1, y1, type } = selectedElement;

    const index = elements.findIndex((el) => el.id === selectedElement.id);

    if (index !== -1) {
      updateElement(
        { id, x1, y1, type, text: e.target.value, index },
        elements
      );

      setAction(null);
      setSelectedElement(null);
    }
  };

  return (
    <>
      <Menu />
      {action === actions.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextAreaBlur}
          style={{
            position: "absolute",
            top: selectedElement.y1 - 3,
            left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : (
        <></>
      )}
      <canvas
        id="canvas"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </>
  );
};

export default Whiteboard;
