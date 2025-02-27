import { useContext, useState } from "react";
import { BoardContext } from "./context/board-context";
import { ToolbarContainer } from "./components/toolbar-container";
import { ToolbarItem } from "./components/toolbar-item";
import { ColorPalette } from "./components/color-palette";
import { Palette, Type } from "lucide-react";

const TextToolbar = () => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const { mode, setMode, setBrushColor, brushColor, brushSize, setBrushSize } =
    useContext(BoardContext);

  // Font size options
  const fontSizes = [
    {
      label: "Small",
      size: 16,
      icon: <Type size={16} />,
    },
    {
      label: "Medium",
      size: 24,
      icon: <Type size={20} />,
    },
    {
      label: "Large",
      size: 32,
      icon: <Type size={24} />,
    },
  ];

  // We'll use brushColor for text color as well
  const tools = [
    ...fontSizes.map((fontSize) => ({
      label: fontSize.label,
      icon: fontSize.icon,
      onClick: () => {
        // We'll use brushSize to store the font size
        setBrushSize(fontSize.size);
      },
      isActive: brushSize === fontSize.size,
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

export { TextToolbar };
