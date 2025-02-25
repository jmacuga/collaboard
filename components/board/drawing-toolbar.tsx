import { Brush, Eraser, Circle, Palette } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { BoardContext } from "./context/board-context";
import { ToolbarContainer } from "./components/toolbar-container";
import { ToolbarItem } from "./components/toolbar-item";
import { ColorPalette } from "./components/color-palette";

const DrawingToolbar = () => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [sizeChangeAnimation, setSizeChangeAnimation] = useState(false);
  const { mode, setMode, setBrushColor, brushSize, setBrushSize, brushColor } =
    useContext(BoardContext);

  useEffect(() => {
    setSizeChangeAnimation(true);
    const timer = setTimeout(() => {
      setSizeChangeAnimation(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [brushSize]);

  const brushSizes = [
    {
      label: "Small",
      size: 2,
      icon: <Circle className="w-2.5 h-2.5 fill-current" />,
    },
    {
      label: "Medium",
      size: 5,
      icon: <Circle className="w-3.5 h-3.5 fill-current" />,
    },
    {
      label: "Large",
      size: 10,
      icon: <Circle className="w-4.5 h-4.5 fill-current" />,
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
      isActive: brushSize === size.size,
    })),
    {
      label: "Colors",
      icon: (
        <div className="relative">
          <Palette />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: brushColor }}
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
          onColorSelect={setBrushColor}
        />
      </ToolbarContainer>
    </>
  );
};

export { DrawingToolbar };
