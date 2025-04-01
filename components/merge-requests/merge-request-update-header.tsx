import Link from "next/link";

interface MergeRequestUpdateHeaderProps {
  boardName: string;
  teamName: string;
  teamId: string;
}

export const MergeRequestUpdateHeader = ({
  boardName,
  teamName,
  teamId,
}: MergeRequestUpdateHeaderProps) => {
  return (
    <div className="bg-white border-b px-4 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          <Link href={`/teams/${teamId}/boards`}>{teamName}</Link>
        </span>
        <span>/</span>
        <span className="font-medium text-foreground">{boardName}</span>
        <span>/</span>
        <span className="font-medium text-foreground">
          Merge Request Update
        </span>
      </div>
    </div>
  );
};
