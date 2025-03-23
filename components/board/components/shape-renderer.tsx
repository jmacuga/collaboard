import { Line, Rect, Circle, Arrow, Text } from "react-konva";
import { ShapeRendererProps } from "@/types/board";
import { KonvaEventObject } from "konva/lib/Node";

export const ShapeRenderer = ({
  id,
  shape,
  mode,
  onShapeClick,
  onDragStart,
  onDragEnd,
  onTransformEnd,
  onTextDblClick,
  ref,
}: ShapeRendererProps) => {
  const commonProps = {
    draggable: mode === "selecting",
    onClick: onShapeClick,
    onDragStart: onDragStart as (e: KonvaEventObject<MouseEvent>) => void,
    onDragEnd: onDragEnd as (e: KonvaEventObject<MouseEvent>) => void,
    onTransformEnd: onTransformEnd as (e: KonvaEventObject<MouseEvent>) => void,
    strokeScaleEnabled: false,
    ref: (node: any) => {
      if (ref) ref(node);
      shape.attrs.ref = node;
    },
  };

  switch (shape.className.val) {
    case "Line":
      return <Line key={id} {...shape.attrs} {...commonProps} />;
    case "Rect":
      return <Rect key={id} {...shape.attrs} {...commonProps} />;
    case "Circle":
      return <Circle key={id} {...shape.attrs} {...commonProps} />;
    case "Arrow":
      return <Arrow key={id} {...shape.attrs} {...commonProps} />;
    case "Text":
      return (
        <Text
          key={id}
          {...shape.attrs}
          {...commonProps}
          onDblClick={onTextDblClick}
        />
      );
    default:
      return null;
  }
};
