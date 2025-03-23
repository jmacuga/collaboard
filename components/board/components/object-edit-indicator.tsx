import { ActiveUser } from "../hooks/use-active-users";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { Group, Rect, Circle, Text } from "react-konva";
import { useState, useEffect, useRef } from "react";

type ObjectEditIndicatorProps = {
  objectId: string;
  editors: ActiveUser[];
  shape: KonvaNodeSchema;
};

export const ObjectEditIndicator = ({
  objectId,
  editors,
  shape,
}: ObjectEditIndicatorProps) => {
  if (!editors.length || !shape) return null;

  const { className, attrs } = shape;

  const getClassName = () => {
    if (typeof className === "string") {
      return className;
    }
    return className?.val || "";
  };

  const shapeType = getClassName();

  const primaryEditor = editors[0];
  const indicatorColor = primaryEditor.color || "#FF5722";

  let x = 0,
    y = 0,
    width = 0,
    height = 0,
    radius = 0,
    points;

  const scaleX = attrs.scaleX || 1;
  const scaleY = attrs.scaleY || 1;
  const rotation = attrs.rotation || 0;
  const offsetX = attrs.offsetX || 0;
  const offsetY = attrs.offsetY || 0;

  switch (shapeType) {
    case "Rect":
      x = attrs.x;
      y = attrs.y;
      width = attrs.width * scaleX;
      height = attrs.height * scaleY;
      break;

    case "Circle":
      x = attrs.x - attrs.radius * scaleX;
      y = attrs.y - attrs.radius * scaleY;
      width = attrs.radius * 2 * scaleX;
      height = attrs.radius * 2 * scaleY;
      radius = attrs.radius * scaleX;
      break;

    case "Text":
      x = attrs.x;
      y = attrs.y;
      width = attrs.width * scaleX;
      height = 30 * scaleY;
      break;

    case "Line":
    case "Arrow":
      points = attrs.points || [];
      if (points.length >= 4) {
        const transformedPoints = [];
        for (let i = 0; i < points.length; i += 2) {
          const px = points[i] * scaleX;
          const py = points[i + 1] * scaleY;

          if (rotation !== 0) {
            const radians = (rotation * Math.PI) / 180;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);

            const rx = px - offsetX;
            const ry = py - offsetY;

            const rotatedX = rx * cos - ry * sin + offsetX;
            const rotatedY = rx * sin + ry * cos + offsetY;

            transformedPoints.push(rotatedX, rotatedY);
          } else {
            transformedPoints.push(px, py);
          }
        }

        const xPoints = transformedPoints.filter(
          (_: number, i: number) => i % 2 === 0
        );
        const yPoints = transformedPoints.filter(
          (_: number, i: number) => i % 2 === 1
        );
        const minX = Math.min(...xPoints);
        const maxX = Math.max(...xPoints);
        const minY = Math.min(...yPoints);
        const maxY = Math.max(...yPoints);

        if (attrs.x == undefined || attrs.y == undefined) {
          x = minX;
          y = minY;
        } else {
          x = attrs.x + minX;
          y = attrs.y + minY;
        }
        width = maxX - minX;
        height = maxY - minY;
      } else {
        return null;
      }
      break;

    default:
      return null;
  }

  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 0.8 ? 0.5 : 0.8));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const editorNames = editors
    .map((editor) => editor.name || editor.email?.split("@")[0] || "Anonymous")
    .join(", ");

  const padding = 4;

  const shouldRotate =
    rotation !== 0 && (shapeType === "Rect" || shapeType === "Text");

  const BADGE_WIDTH = Math.min(150, editorNames.length * 7 + 20);
  const VIEWPORT_WIDTH =
    typeof window !== "undefined" ? window.innerWidth : 1000;
  const VIEWPORT_HEIGHT =
    typeof window !== "undefined" ? window.innerHeight : 800;

  const isNearRightEdge = x + width + BADGE_WIDTH + 10 > VIEWPORT_WIDTH;
  const isNearBottomEdge = y + 30 > VIEWPORT_HEIGHT;

  const labelX = isNearRightEdge ? x - BADGE_WIDTH - 5 : x + width + 5;
  const labelY = isNearBottomEdge ? y - 30 : y;

  return (
    <Group>
      {/* Indicator outline around the shape */}
      {shapeType === "Circle" ? (
        <Circle
          x={attrs.x}
          y={attrs.y}
          radius={radius + padding}
          stroke={indicatorColor}
          strokeWidth={2}
          dash={[5, 5]}
          opacity={opacity}
          perfectDrawEnabled={false}
        />
      ) : (
        <Rect
          x={x - padding}
          y={y - padding}
          width={width + padding * 2}
          height={height + padding * 2}
          stroke={indicatorColor}
          strokeWidth={2}
          dash={[5, 5]}
          opacity={opacity}
          perfectDrawEnabled={false}
          rotation={shouldRotate ? rotation : 0}
          offsetX={shouldRotate ? offsetX * scaleX : 0}
          offsetY={shouldRotate ? offsetY * scaleY : 0}
        />
      )}

      {/* Editor name badge with smart positioning */}
      <Group x={labelX} y={labelY}>
        <Rect
          width={BADGE_WIDTH}
          height={26}
          fill={indicatorColor}
          cornerRadius={4}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
        <Text
          text={`${
            editors.length > 1 ? `${editors.length} users` : editorNames
          }`}
          fill="white"
          fontSize={12}
          padding={5}
          width={BADGE_WIDTH - 10}
          perfectDrawEnabled={false}
        />
      </Group>
    </Group>
  );
};
