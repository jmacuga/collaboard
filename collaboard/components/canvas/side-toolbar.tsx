import {
  FaPaintBrush,
  FaHandPaper,
  FaMousePointer,
  FaCog,
  FaHome,
} from "react-icons/fa";
import Link from "next/link";
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
    {
      label: "Dashboard",
      icon: <FaHome />,
      mode: "dashboard",
      href: "/dashboard",
    },
    { label: "Draw", icon: <FaPaintBrush />, mode: "drawing" },
    { label: "Drag", icon: <FaHandPaper />, mode: "dragging" },
    { label: "Select", icon: <FaMousePointer />, mode: "selecting" },
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
                {item.href ? (
                  <Link className="text-xl" href={item.href}>
                    {item.icon}
                  </Link>
                ) : (
                  <div className="text-xl">{item.icon}</div>
                )}
              </li>
            </Tooltip>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default SideToolbar;
