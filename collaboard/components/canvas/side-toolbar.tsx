import {
  FaPaintBrush,
  FaHandPaper,
  FaMousePointer,
  FaCog,
} from "react-icons/fa";
import { Tooltip } from "./tooltip";
import DrawingToolbar from "./drawing-toolbar";
interface SideToolbarProps {
  setCursorMode: (mode: string) => void;
  cursorMode: string;
  changeBrushColor: (color: string) => void;
}

function SideToolbar({
  setCursorMode,
  cursorMode,
  changeBrushColor,
}: SideToolbarProps) {
  const toolbarItems = [
    { label: "Draw", icon: <FaPaintBrush />, mode: "drawing" },
    { label: "Drag", icon: <FaHandPaper />, mode: "dragging" },
    { label: "Select", icon: <FaMousePointer />, mode: "selecting" },
    { label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="fixed top-4 left-4 h-auto bg-bice-blue text-white shadow-lg rounded-3xl p-3">
      <nav>
        <ul className="space-y-4">
          {cursorMode === "drawing" && (
            <DrawingToolbar changeBrushColor={changeBrushColor} />
          )}
          {toolbarItems.map((item, index) => (
            <Tooltip key={index} content={item.label}>
              <li
                key={index}
                className="flex flex-col items-center p-2 cursor-pointer hover:text-tiffany-blue rounded-xl transition-all transform hover:scale-110"
                onClick={() => item.mode && setCursorMode(item.mode)}
              >
                <div className="text-xl">{item.icon}</div>
              </li>
            </Tooltip>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default SideToolbar;
