import {
  Brush,
  Eraser,
  MousePointer,
  Move,
  Home,
  Square,
  Type,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext } from "react";
import { BoardContext } from "@/components/board/context/board-context";
import { DrawingToolbar } from "@/components/board/drawing-toolbar";
import { ShapesToolbar } from "@/components/board/shapes-toolbar";
import { TextToolbar } from "@/components/board/text-toolbar";
import { BoardMode } from "@/types/board";

type ToolbarItem = {
  icon: React.ReactNode;
  label: string;
  mode: BoardMode;
  href?: string;
};

function SideToolbar({ teamId }: { teamId: string }) {
  const { mode, setBoardMode } = useContext(BoardContext);
  const toolbarItems: ToolbarItem[] = [
    {
      icon: <Home size={20} />,
      label: "Back to boards",
      mode: "teams",
      href: `/teams/${teamId}/boards`,
    },
    {
      icon: <Brush size={20} />,
      label: "Drawing",
      mode: "drawing",
    },
    {
      icon: <Eraser size={20} />,
      label: "Erasing",
      mode: "erasing",
    },
    {
      icon: <Square size={20} />,
      label: "Shapes",
      mode: "shapes",
    },
    {
      icon: <Type size={20} />,
      label: "Text",
      mode: "text",
    },
    {
      icon: <Move size={20} />,
      label: "Panning",
      mode: "panning",
    },
    {
      icon: <MousePointer size={20} />,
      label: "Selecting",
      mode: "selecting",
    },
  ];

  const handleItemClick = (mode: BoardMode) => {
    if (mode) {
      setBoardMode(mode);
    }
  };

  return (
    <>
      <TooltipProvider>
        <div
          className="fixed top-24 left-4 h-auto bg-gray-800 text-white shadow-lg rounded-3xl p-3 z-10"
          role="toolbar"
          aria-label="Canvas tools"
        >
          <nav>
            <ul className="space-y-4" role="list">
              {toolbarItems.map((item, index) => (
                <Tooltip key={item.mode || index}>
                  <TooltipTrigger asChild>
                    <li
                      className={`flex flex-col items-center p-2 cursor-pointer rounded-xl transition-all duration-200 ${
                        mode === item.mode
                          ? "text-tiffany-blue scale-102 shadow-[0_0_8px_rgba(138,219,196,0.3)]"
                          : "hover:text-tiffany-blue hover:scale-105"
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-label={item.label}
                      onClick={() => handleItemClick(item.mode as BoardMode)}
                      aria-pressed={mode === item.mode}
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
                        <div className="flex flex-col items-center">
                          <div className="text-xl">{item.icon}</div>
                          {mode === item.mode && (
                            <span className="text-xs mt-1 font-medium opacity-80 animate-in fade-in duration-150">
                              {item.label}
                            </span>
                          )}
                        </div>
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

      <div className="fixed top-4 left-24 ml-2 z-10">
        {mode === "drawing" && <DrawingToolbar />}
        {mode === "shapes" && <ShapesToolbar />}
        {mode === "text" && <TextToolbar />}
      </div>
    </>
  );
}

export default SideToolbar;
