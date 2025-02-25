import {
  Square,
  Circle as CircleIcon,
  ArrowRight,
  Palette,
} from "lucide-react";
import { useContext, useState } from "react";
import { BoardContext } from "./context/board-context";
import { ToolbarContainer } from "./components/toolbar-container";
import { ToolbarItem } from "./components/toolbar-item";
import { ColorPalette } from "./components/color-palette";

const ShapesToolbar = () => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const { mode, setMode, setShapeColor, shapeType, setShapeType, shapeColor } =
    useContext(BoardContext);

  const tools = [
    {
      label: "Rectangle",
      icon: <Square className="fill-none" />,
      onClick: () => {
        setMode("shapes");
        setShapeType("rectangle");
      },
      isActive: mode === "shapes" && shapeType === "rectangle",
    },
    {
      label: "Circle",
      icon: <CircleIcon className="fill-none" />,
      onClick: () => {
        setMode("shapes");
        setShapeType("circle");
      },
      isActive: mode === "shapes" && shapeType === "circle",
    },
    {
      label: "Arrow",
      icon: <ArrowRight />,
      onClick: () => {
        setMode("shapes");
        setShapeType("arrow");
      },
      isActive: mode === "shapes" && shapeType === "arrow",
    },
    {
      label: "Colors",
      icon: (
        <div className="relative">
          <Palette />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: shapeColor }}
          />
        </div>
      ),
      onClick: () => setIsColorPaletteOpen(!isColorPaletteOpen),
      isActive: isColorPaletteOpen,
    },
  ];

  return (
    <>
      <ToolbarContainer>
        {tools.map((tool, index) => (
          <ToolbarItem key={index} {...tool} />
        ))}
        <ColorPalette
          isOpen={isColorPaletteOpen}
          onColorSelect={setShapeColor}
        />
      </ToolbarContainer>
    </>
  );
};

export { ShapesToolbar };
