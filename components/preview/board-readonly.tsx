import { Doc } from "@automerge/automerge";
import { Layer } from "react-konva";
import { Stage } from "react-konva";
import { ShapeRenderer } from "../board/components/shape-renderer";
import { KonvaNodeSchema, LayerSchema } from "@/types/stage-schema";
import { useWindowDimensions } from "../board/hooks/use-window-dimensions";

export default function BoardReadonly({ doc }: { doc: Doc<LayerSchema> }) {
  const { width, height } = useWindowDimensions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="relative">
        <Stage
          width={width}
          height={height}
          x={0}
          y={0}
          className="bg-white/50 backdrop-blur-sm"
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
      </div>
    </div>
  );
}
