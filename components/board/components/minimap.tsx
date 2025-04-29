import { useContext, useMemo, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { BoardContext } from "../context/board-context";
import { KonvaNodeSchema } from "@/types/stage-schema";
import { ShapeRenderer } from "./shape-renderer";
import { useWindowDimensions } from "../hooks/use-window-dimensions";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MinimapProps {
  localDoc: Record<string, KonvaNodeSchema>;
  scale?: number;
}

const MINIMAP_SIZE = 200;

export const Minimap = ({ localDoc }: MinimapProps) => {
  const { stagePosition, maxWidth, maxHeight } = useContext(BoardContext);
  const scale = MINIMAP_SIZE / maxWidth;
  const { width, height } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true);

  const handleToggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const visibleArea = useMemo(() => {
    const viewportWidth = width;
    const viewportHeight = height;
    return {
      x: -stagePosition.x,
      y: -stagePosition.y,
      width: viewportWidth,
      height: viewportHeight,
    };
  }, [stagePosition, scale, width, height]);

  const objects = useMemo(() => {
    return Object.entries(localDoc).map(([id, shape]) => {
      const { ref, ...newAttrs } = shape.attrs;
      return {
        attrs: newAttrs,
        className: shape.className,
        id,
      };
    });
  }, [localDoc, scale]);

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleToggleVisibility}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleToggleVisibility();
                }
              }}
              className={cn(
                "absolute bottom-20 right-6 bg-white/95 shadow-lg rounded-lg px-4 py-2.5 flex items-center gap-2 border border-gray-200 backdrop-blur-sm transition-all hover:shadow-md",
                isVisible ? "text-gray-900" : "text-gray-400"
              )}
              variant="ghost"
              aria-label={isVisible ? "Hide minimap" : "Show minimap"}
              tabIndex={0}
            >
              <Map className="h-4 w-4" />
              <span className="text-xs font-medium whitespace-nowrap">
                {isVisible ? "Hide Map" : "Show Map"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="p-2 text-xs bg-gray-800 text-white border-gray-700"
          >
            {isVisible ? "Hide the minimap" : "Show the minimap"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isVisible && (
        <div className="absolute bottom-32 right-6 bg-white/80 rounded-lg p-1 shadow-lg">
          <Stage
            width={MINIMAP_SIZE}
            height={MINIMAP_SIZE}
            scale={{ x: scale, y: scale }}
          >
            <Layer>
              {/* Draw the board boundary */}
              <Rect
                x={0}
                y={0}
                width={MINIMAP_SIZE / scale}
                height={MINIMAP_SIZE / scale}
                fill="#f0f0f0"
                stroke="#ccc"
                strokeWidth={1}
              />

              {/* Draw objects */}
              {objects.map(({ attrs, className, id }) => (
                <ShapeRenderer
                  key={`minimap-${id}`}
                  id={id}
                  shape={{ attrs, className }}
                />
              ))}

              {/* Draw visible area rectangle */}
              <Rect
                x={visibleArea.x}
                y={visibleArea.y}
                width={visibleArea.width}
                height={visibleArea.height}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth={2 / scale}
                dash={[5 / scale, 5 / scale]}
              />
            </Layer>
          </Stage>
        </div>
      )}
    </>
  );
};
