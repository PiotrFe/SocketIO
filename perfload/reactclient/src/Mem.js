import React from "react";
import drawCircle from "./utilities/canvasLoadAnimation";

function Mem(props) {
  const { totalMem, usedMem, memUsage, freeMem } = props.memData;
  const canvas = document.querySelector(".memCanvas");
  drawCircle(canvas, memUsage);

  return (
    <div className="col-sm-3 mem">
      <h3>Mem</h3>
      <div className="canvas-wrapper">
        <canvas className="memCanvas" width="200" height="200"></canvas>
        <div className="mem-text">{memUsage}</div>
      </div>
    </div>
  );
}

export default Mem;
