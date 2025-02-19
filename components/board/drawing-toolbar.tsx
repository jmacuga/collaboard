import { Brush, Eraser, Circle, Palette } from "lucide-react";
import { useContext, useState } from "react";
import { BoardContext } from "./context/board-context";
import { ToolbarContainer } from "./components/toolbar-container";
import { ToolbarItem } from "./components/toolbar-item";
import { ColorPalette } from "./components/color-palette";

const DrawingToolbar = () => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const { mode, setMode, setBrushColor, setBrushSize } =
    useContext(BoardContext);

  const brushSizes = [
    {
      label: "Small",
      size: 2,
      icon: <Circle className="w-3 h-3 fill-current" />,
    },
    {
      label: "Medium",
      size: 5,
      icon: <Circle className="w-4 h-4 fill-current" />,
    },
    {
      label: "Large",
      size: 10,
      icon: <Circle className="w-5 h-5 fill-current" />,
    },
  ];

  const tools = [
    {
      label: "Brush",
      icon: <Brush />,
      onClick: () => setMode("drawing"),
      isActive: mode === "drawing",
    },
    {
      label: "Eraser",
      icon: <Eraser />,
      onClick: () => setMode("erasing"),
      isActive: mode === "erasing",
    },
    ...brushSizes.map((size) => ({
      label: size.label,
      icon: size.icon,
      onClick: () => setBrushSize(size.size),
      isActive: false,
    })),
    {
      label: "Colors",
      icon: <Palette />,
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
          onColorSelect={setBrushColor}
        />
      </ToolbarContainer>
    </>
  );
};

export { DrawingToolbar };
