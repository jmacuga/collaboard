import { Doc } from "@automerge/automerge";
import { Layer } from "react-konva";
import { Stage } from "react-konva";
import { ShapeRenderer } from "../board/components/shape-renderer";
import { KonvaNodeSchema, StageSchema } from "@/types/stage-schema";
import { useWindowDimensions } from "../board/hooks/use-window-dimensions";
import { useContext } from "react";
import { BoardContext } from "../board/context/board-context";
import { useBoardPanning } from "../board/hooks/use-board-panning";
import { Minimap } from "../board/components/minimap";

export default function BoardReadonly({ doc }: { doc: Doc<StageSchema> }) {
  const { width, height } = useWindowDimensions();
  const { stagePosition } = useContext(BoardContext);
  const { handleBoardPanStart, handleBoardPanMove, handleBoardPanEnd } =
    useBoardPanning();

  return (
    <div className="h-full bg-gradient-to-b from-background to-muted/20">
      <div className="relative h-full">
        <Stage
          width={width}
          height={height}
          x={stagePosition.x}
          y={stagePosition.y}
          className="bg-white/50 backdrop-blur-sm"
          onMouseDown={handleBoardPanStart}
          onMouseMove={handleBoardPanMove}
          onMouseUp={handleBoardPanEnd}
        >
          <Layer>
            {doc &&
              (Object.entries(doc) as [string, KonvaNodeSchema][]).map(
                ([id, shape]) => (
                  <ShapeRenderer key={id} id={id} shape={shape} />
                )
              )}
          </Layer>
        </Stage>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/5 to-transparent" />
        {doc && <Minimap localDoc={doc} />}
      </div>
    </div>
  );
}
