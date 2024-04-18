import { createElement } from "./createElement";
import { TOOL_TYPES } from "../../constants";
import { store } from "../../store/store";
import { setElements } from "../whiteboardSlice";
import { emitElementUpdate } from "../../socket/socket";

export const updatePencilElementWhenMoving = (
  { index, newPoints },
  elements
) => {
  let elementsCopy = [...elements];

  elementsCopy[index] = {
    ...elementsCopy[index],
    points: newPoints,
  };

  const updatedPencilElements = elementsCopy[index];

  store.dispatch(setElements(elementsCopy));

  emitElementUpdate(updatedPencilElements);
};

export const updateElement = (
  { id, x1, y1, x2, y2, type, index, text },
  elements
) => {
  const elementsCopy = [...elements];

  switch (type) {
    case TOOL_TYPES.PENCIL:
      elementsCopy[index] = {
        ...elementsCopy[index],
        points: [...elementsCopy[index].points, { x: x2, y: y2 }],
      };
      const updatedPencilElement = elementsCopy[index];

      store.dispatch(setElements(elementsCopy));

      emitElementUpdate(updatedPencilElement);
      break;

    case TOOL_TYPES.LINE:
    case TOOL_TYPES.RECTANGLE:
      const updatedElement = createElement({
        id,
        x1,
        y1,
        x2,
        y2,
        toolType: type,
      });
      elementsCopy[index] = updatedElement;

      store.dispatch(setElements(elementsCopy));

      emitElementUpdate(updatedElement);

      break;

    case TOOL_TYPES.TEXT:
      const textWidth = document
        .getElementById("canvas")
        .getContext("2d")
        .measureText(text).width;

      const textHeight = 24;

      elementsCopy[index] = {
        ...createElement({
          id,
          x1,
          y1,
          x2: x1 + textWidth,
          y2: y1 + textHeight,
          toolType: type,
          text,
        }),
      };

      const updatedTextElement = elementsCopy[index];
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedTextElement);

      break;

    default:
      throw new Error("Something went wrong whenn updating element");
  }
};
