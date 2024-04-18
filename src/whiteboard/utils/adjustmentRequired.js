import { TOOL_TYPES } from "../../constants";

export const adjustmentRequired = (type) =>
  [TOOL_TYPES.RECTANGLE, TOOL_TYPES.LINE].includes(type);
