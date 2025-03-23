import { KonvaNodeSchema } from "./KonvaNodeSchema";
import { KonvaEventObject } from "konva/lib/Node";

export type BoardMode =
  | "drawing"
  | "erasing"
  | "selecting"
  | "shapes"
  | "panning"
  | "teams"
  | "text";

export interface BoardShapeProps {
  id: string;
  shape: KonvaNodeSchema;
  mode: BoardMode;
  onShapeClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragStart: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (e: KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: KonvaEventObject<MouseEvent>) => void;
  onTextDblClick?: (e: KonvaEventObject<MouseEvent>) => void;
}

export interface BoardProps {
  isOnline: boolean;
  activeUsers: string[];
  objectEditors: Record<string, string[]>;
}

export interface ShapeRendererProps extends BoardShapeProps {
  ref?: (node: any) => void;
}
