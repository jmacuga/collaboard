import { useContext, useState, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { colorTools } from "./color-palette";
import ColorIcon from "../color-icon";
import { useTransformer } from "../hooks/use-transformer";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useClientSync } from "../context/client-doc-context";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Palette } from "lucide-react";

const ShapeColorPalette = () => {
  const { selectedShapeIds, mode } = useContext(BoardContext);
  const clientSyncService = useClientSync();
  const [localDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const { changeSelectedShapesColor } = useTransformer(localDoc);
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("rgb(0,0,0)");

  useEffect(() => {
    if (selectedShapeIds.length > 0 && localDoc) {
      const shapeId = selectedShapeIds[0];
      const shape = localDoc[shapeId];
      if (shape && shape.attrs.stroke) {
        setCurrentColor(shape.attrs.stroke);
      }
    }
  }, [selectedShapeIds, localDoc]);

  // Don't render if no shapes are selected or not in selecting mode
  if (selectedShapeIds.length === 0 || mode !== "selecting") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex flex-col items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors mb-2 relative"
          title="Change shape color (C)"
          aria-label="Change shape color"
        >
          <Palette size={20} />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white"
            style={{ backgroundColor: currentColor }}
          />
        </button>

        <div
          className={`bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1 transition-all duration-300 transform origin-bottom ${
            isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 h-0"
          }`}
        >
          <div className="flex space-x-2 py-2 px-1">
            {colorTools.map((color, index) => (
              <div
                key={index}
                className={`flex flex-col items-center cursor-pointer rounded-xl transition-all transform hover:scale-110 ${
                  color.color === currentColor
                    ? "ring-2 ring-blue-500 ring-offset-1"
                    : ""
                }`}
                title={`${color.label} (${index + 1})`}
                onClick={() => {
                  changeSelectedShapesColor(color.color);
                  setCurrentColor(color.color);
                  setIsOpen(false);
                }}
              >
                <ColorIcon className={color.className} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ShapeColorPalette };
