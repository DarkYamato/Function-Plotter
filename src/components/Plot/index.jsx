import React, { useRef, useEffect } from "react";

const width = 400;
const height = 400;

const Plot = ({ expression, from, to, setIsValid }) => {
  const expr = `return ${expression
    .replace("sqrt", "Math.sqrt")
    .replace("^", "**")
    .split("")
    .reduce((acc, x, i, arr) => {
      arr[i + 1] === "+" ? acc.push(`Number(${x})`) : acc.push(x);
      return acc;
    }, [])
    .join("")}`;
  const canvasRef = useRef(null);

  let fn = () => {};
  const points = [];

  try {
    fn = new Function("x", expr);
    for (let i = from; to >= i; i++) {
      points.push({ x: Number(i), fx: fn(i) });
    }
  } catch (e) {
    setIsValid(false);
  }

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    drawAxis(context);
    if (!!points.length) {
      drawGraphic(context, points);
    }
  }, [canvasRef, expression, from, to, points]);

  return <canvas ref={canvasRef} height={height} width={width} />;
};

const drawAxis = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  ctx.font = "14px arial";
  ctx.fillText("x", width - 15, height / 2 + 15);
  ctx.fillText("f(x)", width / 2 - 30, 15);
  ctx.fillText("0", width / 2 - 12, height / 2 + 15);

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "black";
  for (let i = 0; i <= 20; i++) {
    ctx.moveTo((width / 20) * i + 0.5, height / 2 - 5);
    ctx.lineTo((width / 20) * i + 0.5, height / 2 + 5);
  }
  ctx.stroke();

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "black";
  for (let i = 0; i <= 20; i++) {
    ctx.moveTo(width / 2 - 5, (height / 20) * i + 0.5);
    ctx.lineTo(width / 2 + 5, (height / 20) * i + 0.5);
  }
  ctx.stroke();
};

const drawGraphic = (ctx, points) => {
  const lastItem = points[points.length - 1];
  const firstItem = points[0];
  const maxFx = lastItem.fx;
  const maxX = lastItem.x;
  const xCellSize = 1 / (maxX / (width / 2));
  const fxCellSize = 1 / (maxFx / (height / 2));

  ctx.clearRect(0, 0, width, height);
  drawAxis(ctx);
  ctx.save();
  ctx.font = "14px arial";
  ctx.textBaseline = "top";
  ctx.textAlign = "right";
  ctx.fillText(maxX, width - 8, height / 2 - 20);
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(maxFx, width / 2 + 8, 5);
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(`-${maxX}`, 2, height / 2 - 20);
  ctx.textBaseline = "bottom";
  ctx.textAlign = "right";
  ctx.fillText(`-${maxFx}`, width / 2 - 8, height);

  ctx.translate(width / 2, height / 2);

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "blue";
  ctx.moveTo(firstItem.x * xCellSize, -firstItem.fx * fxCellSize);
  for (let i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].x * xCellSize, -points[i].fx * fxCellSize);
  }
  ctx.stroke();

  ctx.restore();
};

export default Plot;
