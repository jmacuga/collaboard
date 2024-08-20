import Room from "../../ui/room/room";

export default function CanvasPage({ params }: { params: { id: string } }) {
  console.log("Room id: ", params.id);
  return <Room id={params.id} />;
}
