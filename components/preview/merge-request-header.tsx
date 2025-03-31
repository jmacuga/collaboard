import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { MergeRequest, User } from "@prisma/client";
import RejectButton from "../merge-requests/reject-button";
import AcceptButton from "../merge-requests/accept-button";

interface MergeRequestHeaderProps {
  mergeRequest: MergeRequest & { requester: User };
  isUserReviewer: boolean;
}

export const MergeRequestHeader = ({
  mergeRequest,
  isUserReviewer,
}: MergeRequestHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between border-b border-border p-3">
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
          aria-label="Back to board"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Merge Request Review
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Created by: {mergeRequest.requester.email}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Created at: {mergeRequest.createdAt.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {isUserReviewer && mergeRequest.status === "OPEN" && (
        <div className="flex gap-2 justify-end">
          <RejectButton
            mergeRequestId={mergeRequest.id}
            boardId={mergeRequest.boardId}
          />
          <AcceptButton
            mergeRequestId={mergeRequest.id}
            boardId={mergeRequest.boardId}
          />
        </div>
      )}
    </div>
  );
};
