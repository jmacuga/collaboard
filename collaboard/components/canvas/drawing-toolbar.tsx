import { FaPaintBrush, FaEraser } from "react-icons/fa";
import ColorIcon from "./color-icon";

function DrawingToolbar({
  changeBrushColor,
}: {
  changeBrushColor: (color: string) => void;
}) {
  const handleBrushColor = (e) => {
    const rgbaColor = window.getComputedStyle(e.target).backgroundColor;
    console.log("Brush color");
    console.log(rgbaColor);
    changeBrushColor(rgbaColor);
  };

  const drawingTools = [
    { label: "Brush", icon: <FaPaintBrush /> },
    { label: "Eraser", icon: <FaEraser /> },
    {
      label: "White",
      icon: <ColorIcon className="bg-white" />,
      onclick: handleBrushColor,
    },
    {
      label: "Black",
      icon: <ColorIcon className="bg-black" />,
      onclick: handleBrushColor,
    },
    {
      label: "Purple",
      icon: <ColorIcon className="bg-purple-500" />,
      onclick: handleBrushColor,
    },
    {
      label: "Pink",
      icon: <ColorIcon className="bg-pink-500" />,
      onclick: handleBrushColor,
    },
    {
      label: "Red",
      icon: <ColorIcon className="bg-red-500" />,
      onclick: handleBrushColor,
    },
    {
      label: "Orange",
      icon: <ColorIcon className="bg-orange-400" />,
      onclick: handleBrushColor,
    },
    {
      label: "Yellow",
      icon: <ColorIcon className="bg-yellow-400" />,
      onclick: handleBrushColor,
    },
    {
      label: "Green",
      icon: <ColorIcon className="bg-green-500" />,
      onclick: handleBrushColor,
    },
    {
      label: "Blue",
      icon: <ColorIcon className="bg-blue-400" />,
      onclick: handleBrushColor,
    },
  ];

  return (
    <div className="fixed top-6 left-20 h-auto bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1">
      <nav>
        <ul className="space-y-4 py-2">
          {drawingTools.map((tool, index) => (
            <li
              key={index}
              className="flex flex-col items-center px-1 cursor-pointer rounded-xl transition-all transform hover:scale-110"
            >
              <div onClick={tool.onclick ?? undefined} className="text-2xl ">
                {tool.icon}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default DrawingToolbar;
