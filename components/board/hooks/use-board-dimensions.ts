import { useState, useEffect } from "react";

interface BoardDimensions {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
}

export const useBoardDimensions = (
  maxWidth: number = 5000,
  maxHeight: number = 5000
): BoardDimensions => {
  const [dimensions, setDimensions] = useState<BoardDimensions>({
    width: 0,
    height: 0,
    maxWidth,
    maxHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions((prev) => ({
        ...prev,
        width: Math.min(window.innerWidth, maxWidth),
        height: Math.min(window.innerHeight, maxHeight),
      }));
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [maxWidth, maxHeight]);

  return dimensions;
};
