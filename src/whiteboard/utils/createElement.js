import rough from "roughjs/bundled/rough.esm";
import { TOOL_TYPES } from "../../constants";

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }) => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};

const generateLine = ({ x1, y1, x2, y2 }) => {
  return generator.line(x1, y1, x2, y2);
};

export const createElement = ({ x1, y1, x2, y2, toolType, id, text }) => {
  let roughElement;

  switch (toolType) {
    case TOOL_TYPES.RECTANGLE:
      roughElement = generateRectangle({ x1, y1, x2, y2 });
      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };

    case TOOL_TYPES.LINE:
      roughElement = generateLine({ x1, y1, x2, y2 });

      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };

    case TOOL_TYPES.PENCIL:
      return {
        id,
        type: toolType,
        points: [{ x1, y1 }],
      };

    case TOOL_TYPES.TEXT:
      return {
        id,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
        text: text || "",
      };

    default:
      throw new Error("Something went wrong when creating element");
  }
};
