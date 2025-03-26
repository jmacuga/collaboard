import Link from "next/link";

interface BoardHeaderProps {
  boardName: string;
  teamName: string;
  teamId: string;
}

export const BoardHeader = ({
  boardName,
  teamName,
  teamId,
}: BoardHeaderProps) => {
  return (
    <div className="bg-white border-b px-4 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          <Link href={`/teams/${teamId}/boards`}>{teamName}</Link>
        </span>
        <span>/</span>
        <span className="font-medium text-foreground">{boardName}</span>
      </div>
    </div>
  );
};
