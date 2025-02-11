"use client";
import dynamic from "next/dynamic";
const CreateBoardDialog = dynamic(
  () =>
    import("@/components/boards/create-board-dialog").then(
      (mod) => mod.CreateBoardDialog
    ),
  {
    ssr: false,
  }
);

export default function CreateBoardDialogWrapper({
  teamId,
}: {
  teamId: string;
}) {
  return <CreateBoardDialog teamId={teamId} />;
}
