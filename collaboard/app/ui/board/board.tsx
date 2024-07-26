
export default function Board({canvasRef}: {canvasRef: React.MutableRefObject<HTMLCanvasElement | null>})  {
  const viewport_width =  window.innerWidth;
  const viewport_height = window.innerHeight
  return (<canvas ref={canvasRef} height={viewport_height} width={viewport_width}/>);
}