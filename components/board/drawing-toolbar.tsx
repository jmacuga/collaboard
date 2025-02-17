import { Brush, Eraser, Circle, Palette } from "lucide-react";
import ColorIcon from "./color-icon";
import { useContext, useState } from "react";
import { BoardContext } from "./context/board-context";

function DrawingToolbar() {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const { mode, setMode, setBrushColor, setBrushSize } =
    useContext(BoardContext);
  const handleBrushColor = (e: React.MouseEvent<HTMLDivElement>) => {
    const rgbaColor = window.getComputedStyle(
      e.target as Element
    ).backgroundColor;
    setBrushColor(rgbaColor);
  };

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

  const colorTools = [
    { label: "White", className: "bg-white" },
    { label: "Black", className: "bg-black" },
    { label: "Purple", className: "bg-purple-500" },
    { label: "Pink", className: "bg-pink-500" },
    { label: "Red", className: "bg-red-500" },
    { label: "Orange", className: "bg-orange-400" },
    { label: "Yellow", className: "bg-yellow-400" },
    { label: "Green", className: "bg-green-500" },
    { label: "Blue", className: "bg-blue-400" },
  ];

  const mainTools = [
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
    <div className="fixed top-6 left-20 flex flex-col">
      <div className="bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1">
        <nav>
          <ul className="space-y-4 py-2">
            {mainTools.map((tool, index) => (
              <li
                key={index}
                className={`flex flex-col items-center px-1 cursor-pointer rounded-xl transition-all transform hover:scale-110
                  ${tool.isActive ? "bg-gray-300" : ""}`}
                title={tool.label}
              >
                <div onClick={tool.onClick} className="text-2xl">
                  {tool.icon}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`mt-2 bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1 transition-all duration-300 transform origin-top ${
          isColorPaletteOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 h-0"
        }`}
      >
        <nav>
          <ul className="space-y-4 py-2">
            {colorTools.map((color, index) => (
              <li
                key={index}
                className="flex flex-col items-center px-1 cursor-pointer rounded-xl transition-all transform hover:scale-110"
                title={color.label}
              >
                <div onClick={handleBrushColor} className="text-2xl">
                  <ColorIcon className={color.className} />
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default DrawingToolbar;
