import { Brush, Hand, MousePointer, Home } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DrawingToolbar from "@/components/board/drawing-toolbar";

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
      label: "Back to teams",
      icon: <Home />,
      mode: "teams",
      href: "/teams",
    },
    { label: "Draw", icon: <Brush />, mode: "drawing" },
    { label: "Drag", icon: <Hand />, mode: "dragging" },
    { label: "Select", icon: <MousePointer />, mode: "selecting" },
  ];

  const handleItemClick = (mode: string) => {
    if (mode) {
      setCursorMode(mode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, mode: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleItemClick(mode);
    }
  };

  return (
    <TooltipProvider>
      <div
        className="fixed top-4 left-4 h-auto bg-gray-800 text-white shadow-lg rounded-3xl p-3"
        role="toolbar"
        aria-label="Canvas tools"
      >
        <nav>
          <ul className="space-y-4" role="list">
            {cursorMode === "drawing" && (
              <DrawingToolbar changeBrushColor={changeBrushColor} />
            )}
            {toolbarItems.map((item, index) => (
              <Tooltip key={item.mode || index}>
                <TooltipTrigger asChild>
                  <li
                    className="flex flex-col items-center p-2 cursor-pointer hover:text-tiffany-blue rounded-xl transition-all transform hover:scale-110"
                    role="button"
                    tabIndex={0}
                    aria-label={item.label}
                    onClick={() => handleItemClick(item.mode)}
                    onKeyDown={(e) => handleKeyDown(e, item.mode)}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-xl"
                        aria-label={`Go to ${item.label}`}
                      >
                        {item.icon}
                      </Link>
                    ) : (
                      <div className="text-xl">{item.icon}</div>
                    )}
                  </li>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}

export default SideToolbar;
