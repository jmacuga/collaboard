import { GitPullRequest } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MergeRequestCounter = ({
  openRequests,
}: {
  openRequests: number;
}) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    const boardId = router.query.id as string;
    router.push(`/boards/${boardId}/merge-requests`);
  };

  // Return a placeholder during SSR to prevent hydration mismatches
  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}> 
      <button
        onClick={handleClick}
        className="bg-white/95 shadow-lg rounded-lg px-4 py-2.5 flex items-center gap-2 border border-gray-200 backdrop-blur-sm transition-all hover:shadow-md hover:bg-gray-50"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center gap-2"
              aria-label={`${openRequests} open merge requests`}
            >
              <GitPullRequest
                className={cn(
                  "h-4 w-4 transition-colors",
                  openRequests > 0 ? "text-blue-500" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  openRequests > 0 ? "text-blue-500" : "text-gray-400"
                )}
              >
                {openRequests}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="start"
            className="p-2 text-xs bg-gray-800 text-white border-gray-700"
          >
            {openRequests === 0
              ? "No open merge requests"
              : `${openRequests} open merge request${
                  openRequests === 1 ? "" : "s"
                }`}
          </TooltipContent>
        </Tooltip>
      </button>
    </TooltipProvider>
  );
};
