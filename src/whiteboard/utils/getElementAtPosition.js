import { TOOL_TYPES, CURSOR_POSITIONS } from "../../constants";

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const onLine = ({ x1, y1, x2, y2, x, y, maxDistance = 1 }) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };

  const offset = distance(a, b) - (distance(a, c) + distance(b, c));

  return Math.abs(offset) < maxDistance ? CURSOR_POSITIONS.INSIDE : null;
};

const nearPoint = (x, y, x1, y1, cursorPosition) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? cursorPosition : null;
};

const positionWithinElements = (x, y, element) => {
  const { type, x1, y1, x2, y2 } = element;

  switch (type) {
    case TOOL_TYPES.RECTANGLE:
      const topLeft = nearPoint(x, y, x1, y1, CURSOR_POSITIONS.TOP_LEFT);
      const topRight = nearPoint(x, y, x2, y1, CURSOR_POSITIONS.TOP_RIGHT);
      const bottomLeft = nearPoint(x, y, x1, y2, CURSOR_POSITIONS.BOTTOM_LEFT);
      const bottomRight = nearPoint(
        x,
        y,
        x2,
        y2,
        CURSOR_POSITIONS.BOTTOM_RIGHT
      );

      const inside =
        x >= x1 && x <= x2 && y >= y1 && y <= y2
          ? CURSOR_POSITIONS.INSIDE
          : null;

      return topLeft || topRight || bottomLeft || bottomRight || inside;

    case TOOL_TYPES.TEXT:
      return x >= x1 && x <= x2 && y >= y1 && y <= y2
        ? CURSOR_POSITIONS.INSIDE
        : null;

    case TOOL_TYPES.LINE:
      const on = onLine({ x1, y1, x2, y2, x, y });
      const start = nearPoint(x, y, x1, y1, CURSOR_POSITIONS.START);
      const end = nearPoint(x, y, x2, y2, CURSOR_POSITIONS.END);

      return start || end || on;

    case TOOL_TYPES.PENCIL:
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;

        return onLine({
          x1: point.x,
          y1: point.y,
          x2: nextPoint.x,
          y2: nextPoint.y,
          x,
          y,
          maxDistance: 5,
        });
      });

      return betweenAnyPoint ? CURSOR_POSITIONS.INSIDE : null;
  }
};

export const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((el) => ({
      ...el,
      position: positionWithinElements(x, y, el),
    }))
    .find(
      (element) => element.position !== null && element.position !== undefined
    );
};
