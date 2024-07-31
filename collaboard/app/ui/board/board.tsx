export default function Board({
  canvasRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) {
  return <canvas ref={canvasRef} />;
}
