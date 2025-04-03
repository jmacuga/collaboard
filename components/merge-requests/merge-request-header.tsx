import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { MergeRequest, User } from "@prisma/client";
import RejectButton from "./reject-button";
import AcceptButton from "./accept-button";
import CloseButton from "./close-button";
import Link from "next/link";
interface MergeRequestHeaderProps {
  mergeRequest: MergeRequest & { requester: User };
  isUserReviewer: boolean;
  isUserRequester: boolean;
}

export const MergeRequestHeader = ({
  mergeRequest,
  isUserReviewer,
  isUserRequester,
}: MergeRequestHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(`/boards/${mergeRequest.boardId}/merge-requests`);
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
              Merge Request Result Preview
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
      <div className="flex gap-2 justify-end">
        {isUserReviewer && mergeRequest.status === "OPEN" && (
          <>
            <RejectButton
              mergeRequestId={mergeRequest.id}
              boardId={mergeRequest.boardId}
            />
            <AcceptButton
              mergeRequestId={mergeRequest.id}
              boardId={mergeRequest.boardId}
            />
          </>
        )}
        {mergeRequest.status == "OPEN" && isUserRequester && (
          <>
            <CloseButton
              mergeRequestId={mergeRequest.id}
              boardId={mergeRequest.boardId}
            />
            <Link
              href={`/boards/${mergeRequest.boardId}/merge-requests/${mergeRequest.id}/update`}
            >
              <Button variant="outline">Update</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
