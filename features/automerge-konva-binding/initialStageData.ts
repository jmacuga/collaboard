"use client";
import Konva from "konva";

export default function initialStageData() {
  const layer = new Konva.Layer();
  const line = new Konva.Line({
    //wingle jignle line
    points: [50, 56, 434, 879, 343, 456, 354],
    stroke: "#df4b26",
    strokeWidth: 5,
    tension: 0.5,
  });
  layer.add(line);

  return layer;
}
