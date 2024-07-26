'use client';

import Board from "../ui/board/board";

import { useEffect, useRef } from 'react';
import { initializeFabric, handleCanvasMouseDown } from '@/lib/board/board';
import * as fabric from 'fabric';

export default function BoardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
      const canvas = initializeFabric({
        canvasRef,
        fabricRef,
      });
  

  canvas.on("mouse:down", (options) => {
    handleCanvasMouseDown({
        canvas,
        options,
      });
    });


  return () => {
    canvas.dispose();
  };

  }, [canvasRef]);
return (
    <main>
      <Board canvasRef={canvasRef} />
    </main>
  );
}
