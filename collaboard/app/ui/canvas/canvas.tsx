"use client";

import * as fabric from "fabric";
import React, { useCallback, useEffect, useRef } from "react";

export function useCanvas(
  ref?: React.ForwardedRef<HTMLCanvasElement>,
  init?: (canvas: fabric.Canvas) => any,
  saveState = false,
  deps: any[] = []
) {
  const elementRef = useRef<HTMLCanvasElement | null>(null);
  const fc = useRef<fabric.Canvas | null>(null);

  const setRef = useCallback(
    (el: HTMLCanvasElement | null) => {
      elementRef.current = el;
      ref && (ref.current = elementRef.current);
      fc.current?.dispose();
      if (!el) {
        fc.current = null;
        return;
      }
      const canvas = new fabric.Canvas(el);
      canvas.on("mouse:down", (e) => {
        e.e.preventDefault();
      });
      window.canvas = fc.current = canvas;
      init && init(canvas);
    },
    [saveState, ...deps]
  );
  useEffect(() => {
    return () => {
      if (!elementRef.current) {
        fc.current?.dispose();
        fc.current = null;
      }
    };
  }, [saveState]);

  return [fc, setRef] as [typeof fc, typeof setRef];
}

export const Canvas = React.forwardRef<
  HTMLCanvasElement,
  {
    onLoad?: (canvas: fabric.Canvas) => any;
    saveState?: boolean;
  }
>(({ onLoad, saveState }, ref) => {
  const [canvasRef, setCanvasElRef] = useCanvas(ref, onLoad, saveState);

  return <canvas ref={setCanvasElRef} />;
});
