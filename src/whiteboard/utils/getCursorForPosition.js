import { CURSOR_POSITIONS } from "../../constants";

export const getCursorForPosition = (position) => {
  switch (position) {
    case CURSOR_POSITIONS.TOP_LEFT:
    case CURSOR_POSITIONS.BOTTOM_RIGHT:
    case CURSOR_POSITIONS.START:
    case CURSOR_POSITIONS.END:
      return "nwse-resize";

    case CURSOR_POSITIONS.TOP_RIGHT:
    case CURSOR_POSITIONS.BOTTOM_LEFT:
      return "nesw-resize";

    default:
      return "move";
  }
};
