import { TOOL_TYPES } from "../../constants";

const drawPencilElement = (context, element) => {
  // const myStroke = getStroke(element.points, {
  //   size: 10,
  //   thinning: 0.7,
  // });

  // const pathData = getSvgPathFromStroke(myStroke);

  // const myPath = new Path2D(pathData);

  // context.fill(myPath);

  context.beginPath();
  context.moveTo(element.points[0].x1, element.points[0].y1);

  for (var i = 1; i < element.points.length; i++) {
    context.lineTo(element.points[i].x, element.points[i].y);
  }

  // Set line styles (optional)
  context.lineWidth = 2;
  context.strokeStyle = "black";

  // Draw the path
  context.stroke();
};

const drawTextElement = (context, element) => {
  context.textBaseline = "top";
  context.font = "24px sans-serif"; // move to constants
  context.fillText(element.text, element.x1, element.y1);
};

export const drawElement = ({ roughCanvas, context, element }) => {
  switch (element.type) {
    case TOOL_TYPES.LINE:
    case TOOL_TYPES.RECTANGLE:
      return roughCanvas.draw(element.roughElement);

    case TOOL_TYPES.PENCIL:
      drawPencilElement(context, element);
      break;

    case TOOL_TYPES.TEXT:
      drawTextElement(context, element);
      break;

    default:
      throw new Error("Something went wrong when drawing  the element");
  }
};
