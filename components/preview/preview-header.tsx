import { ArrowLeft } from "lucide-react";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Change } from "@automerge/automerge";
import { RevertDialog } from "./revert-dialog";
import { MergeDialog } from "./merge-dialog";
import { CreateMergeRequestDialog } from "./create-merge-request-dialog";

interface PreviewHeaderProps {
  boardId: string;
  localChanges: Change[];
  docId: string;
  isAdmin: boolean;
}

export function PreviewHeader({
  boardId,
  localChanges,
  docId,
  isAdmin,
}: PreviewHeaderProps) {
  const router = useRouter();

  const handleBackToEditor = () => {
    router.push(`/boards/${boardId}`);
  };

  return (
    <div className="flex items-center justify-between border-b border-border p-3">
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToEditor}
          className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Editor
        </Button>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Board Preview
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              This is a preview of the merged board state.
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {isAdmin ? (
          <MergeDialog boardId={boardId} />
        ) : (
          <CreateMergeRequestDialog
            boardId={boardId}
            localChanges={localChanges}
          />
        )}
        <RevertDialog boardId={boardId} />
      </div>
    </div>
  );
}
