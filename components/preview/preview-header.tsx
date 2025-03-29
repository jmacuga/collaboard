import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { ClientSyncContext } from "@/components/board/context/client-doc-context";
import { useContext } from "react";
import { CreateMergeRequestDialog } from "./create-merge-request-dialog";
import { Change } from "@automerge/automerge";

export const PreviewHeader = ({
  boardId,
  mergeRequestId,
  localChanges,
}: {
  boardId: string;
  mergeRequestId: string;
  localChanges: Change[];
}) => {
  const router = useRouter();
  const { clientSyncService } = useContext(ClientSyncContext);

  const handleBackToEditor = () => {
    router.push(`/boards/${boardId}`);
  };

  const handleRejectChanges = async () => {
    console.log("reject changes");
    if (!clientSyncService) return;
    await clientSyncService.revertLocalChanges();
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
      {mergeRequestId ? (
        <div className="flex gap-2 justify-end">
          <Link href={`/boards/${boardId}/merge-requests/${mergeRequestId}`}>
            <Button variant="outline">Go to Merge Request</Button>
          </Link>
          <Button>Update Merge Request</Button>
          <Button variant="destructive">Reject and Close Merge Request</Button>
        </div>
      ) : (
        <div className="flex gap-2 justify-end">
          <CreateMergeRequestDialog
            boardId={boardId}
            localChanges={localChanges}
          />
          <Button variant="outline" onClick={handleRejectChanges}>
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};
