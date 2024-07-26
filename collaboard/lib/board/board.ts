import * as fabric from 'fabric';

// initialize fabric canvas
export const initializeFabric = ({
    fabricRef,
    canvasRef,
  }: {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  }) => {
    const canvasElement = document.getElementById("canvas");
  
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasElement?.clientWidth,
      height: canvasElement?.clientHeight,
    });
  
    fabricRef.current = canvas;
  
    return canvas;
  };

  export const handleCanvasMouseDown = ({
    options,
    canvas,
  }) => {
    const pointer = canvas.getPointer(options.e);
    const target = canvas.findTarget(options.e, false);
  
    canvas.isDrawingMode = true;
    canvas.isDrawingMode = true;
    var brush = new fabric.PencilBrush(canvas);
    brush.color = 'red';
    brush.width = 4;
    canvas.freeDrawingBrush = brush;
  }

