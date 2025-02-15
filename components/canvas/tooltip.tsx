import { useState, forwardRef } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative" ref={ref}>
        <div
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {children}
        </div>
        {isVisible && (
          <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
