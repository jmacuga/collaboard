import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Change } from "@automerge/automerge";
import { MergeRequest, User } from "@prisma/client";

interface MergeRequestHeaderProps {
  mergeRequest: MergeRequest & { requester: User };
  isUserReviewer: boolean;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

export const MergeRequestHeader = ({
  mergeRequest,
  isUserReviewer,
  onAccept,
  onReject,
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
      {isUserReviewer && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onReject}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            aria-label="Reject merge request"
          >
            Reject Changes
          </Button>
          <Button
            onClick={onAccept}
            className="bg-green-500 text-white hover:bg-green-600"
            aria-label="Accept merge request"
          >
            Accept Changes
          </Button>
        </div>
      )}
    </div>
  );
};
