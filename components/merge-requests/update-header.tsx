import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { UpdateMergeRequestDialog } from "./update-dialog";

export const MergeRequestUpdateHeader = ({
  boardId,
  serverDocUrl,
}: {
  boardId: string;
  serverDocUrl: string;
}) => {
  const router = useRouter();
  const reqId = router.query.reqId as string;

  const handleBack = () => {
    router.push(`/boards/${boardId}/merge-requests/${reqId}`);
  };

  return (
    <div className="flex items-center justify-between border-b border-border p-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5 text-primary" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Update Merge Request
          </h1>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <UpdateMergeRequestDialog
          boardId={boardId}
          mergeRequestId={reqId}
          serverDocUrl={serverDocUrl}
        />
      </div>
    </div>
  );
};
