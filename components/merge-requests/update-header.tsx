import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { UpdateMergeRequestDialog } from "./update-dialog";

interface MergeRequestUpdateHeaderProps {
  boardId: string;
  serverDocId: string;
}

export function MergeRequestUpdateHeader({
  boardId,
  serverDocId,
}: MergeRequestUpdateHeaderProps) {
  const router = useRouter();
  const reqId = router.query.reqId as string;

  const handleBack = () => {
    router.push(`/boards/${boardId}/merge-requests/${reqId}`);
  };

  return (
    <div className="flex items-center justify-between border-b border-border p-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Update Merge Request
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit the board to update the merge request.
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <UpdateMergeRequestDialog
          boardId={boardId}
          mergeRequestId={reqId}
          serverDocId={serverDocId}
        />
      </div>
    </div>
  );
}
