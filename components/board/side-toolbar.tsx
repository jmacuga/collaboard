import { Brush, Hand, MousePointer, Home, Shapes } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DrawingToolbar from "@/components/board/drawing-toolbar";
import { ModeType } from "@/components/board/context/board-context";
import { useContext } from "react";
import { BoardContext } from "@/components/board/context/board-context";

function SideToolbar() {
  const { mode, setMode } = useContext(BoardContext);
  const toolbarItems = [
    {
      label: "Back to teams",
      icon: <Home />,
      mode: "teams",
      href: "/teams",
    },
    { label: "Draw", icon: <Brush />, mode: "drawing" },
    { label: "Shapes", icon: <Shapes />, mode: "shapes" },
    { label: "Drag", icon: <Hand />, mode: "dragging" },
    { label: "Select", icon: <MousePointer />, mode: "selecting" },
  ];

  const handleItemClick = (mode: ModeType) => {
    if (mode) {
      setMode(mode);
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
            {(mode === "drawing" || mode === "erasing") && <DrawingToolbar />}
            {toolbarItems.map((item, index) => (
              <Tooltip key={item.mode || index}>
                <TooltipTrigger asChild>
                  <li
                    className="flex flex-col items-center p-2 cursor-pointer hover:text-tiffany-blue rounded-xl transition-all transform hover:scale-110"
                    role="button"
                    tabIndex={0}
                    aria-label={item.label}
                    onClick={() => handleItemClick(item.mode as ModeType)}
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
