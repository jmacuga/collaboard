import { useContext, useState } from "react";
import { BoardContext } from "./context/board-context";
import { ToolbarContainer } from "./components/toolbar-container";
import { ToolbarItem } from "./components/toolbar-item";
import { ColorPalette } from "./components/color-palette";
import { Palette, Type } from "lucide-react";

const TextToolbar = () => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const { setTextColor, textColor, textFontSize, setTextFontSize } =
    useContext(BoardContext);

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

  const tools = [
    ...fontSizes.map((fontSize) => ({
      label: fontSize.label,
      icon: fontSize.icon,
      onClick: () => {
        setTextFontSize(fontSize.size);
      },
      isActive: textFontSize === fontSize.size,
    })),
    {
      label: "Colors",
      icon: (
        <div className="relative">
          <Palette />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: textColor }}
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
          onColorSelect={setTextColor}
        />
      </ToolbarContainer>
    </>
  );
};

export { TextToolbar };
