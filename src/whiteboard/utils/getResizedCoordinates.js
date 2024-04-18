import { CURSOR_POSITIONS } from "../../constants";

export const getResizedCoordinates = (
  clientX,
  clientY,
  position,
  coordinates
) => {
  const { x1, y1, x2, y2 } = coordinates;

  switch (position) {
    case CURSOR_POSITIONS.START:
    case CURSOR_POSITIONS.TOP_LEFT:
      return { x1: clientX, y1: clientY, x2, y2 };
    case CURSOR_POSITIONS.TOP_RIGHT:
      return { x1, y1: clientY, x2: clientX, y2 };
    case CURSOR_POSITIONS.BOTTOM_LEFT:
      return { x1: clientX, y1, x2, y2: clientY };
    case CURSOR_POSITIONS.END:
    case CURSOR_POSITIONS.BOTTOM_RIGHT:
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null;
  }
};
