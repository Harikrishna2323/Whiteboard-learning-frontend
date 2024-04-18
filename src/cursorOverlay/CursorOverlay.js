import React from "react";
import cursor from "../resources/icons/selection.svg";
import { useSelector } from "react-redux";

const CursorOverlay = () => {
  const cursors = useSelector((state) => state.cursor.cursors);

  return (
    <>
      {cursors?.map((c) => (
        <img
          key={c.userId}
          className="cursor"
          style={{ position: "absolute", left: c.x, top: c.y, width: "30px" }}
          src={cursor}
        />
      ))}
    </>
  );
};

export default CursorOverlay;
