import { MergeRequest, ReviewRequest, User } from "@prisma/client";
import { TableRow } from "../ui/table";
import { TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import AcceptButton from "./accept-button";
import RejectButton from "./reject-button";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import CloseMergeRequestDialog from "./close-dialog";

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  MERGED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default function MergeRequestsRow({
  request,
  isUserRequester,
}: {
  request: MergeRequest & {
    reviewRequests: ReviewRequest & { reviewer: User }[];
    requester: User;
  };
  isUserRequester: boolean;
}) {
  const session = useSession();
  const user = session.data?.user;
  const isUserReviewer = request.reviewRequests.some(
    (reviewRequest) => reviewRequest.reviewer.id === user?.id
  );

  return (
    <TableRow>
      <TableCell>
        <Badge
          className={`${statusColors[request.status]} font-medium`}
          variant="secondary"
        >
          {request.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{request.requester.name}</span>
          <span className="text-sm text-gray-500">
            {request.requester.email}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {request.reviewRequests.length > 0 ? (
          <div className="flex flex-col">
            <span className="font-medium">
              {request.reviewRequests[0].reviewer.name}
            </span>
            <span className="text-sm text-gray-500">
              {request.reviewRequests[0].reviewer.email}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No reviewers assigned</span>
        )}
      </TableCell>
      <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
      <TableCell>{new Date(request.updatedAt).toLocaleString()}</TableCell>
      <TableCell>
        <div className="flex flex-row gap-2">
          {(request.status == "PENDING" || request.status == "OPEN") && (
            <Link
              href={`/boards/${request.boardId}/merge-requests/${request.id}`}
            >
              <Button variant="outline">View</Button>
            </Link>
          )}
          {isUserReviewer &&
            (request.status == "PENDING" || request.status == "OPEN") && (
              <>
                <AcceptButton
                  mergeRequestId={request.id}
                  boardId={request.boardId}
                />
                <RejectButton
                  mergeRequestId={request.id}
                  boardId={request.boardId}
                />
              </>
            )}
          {request.status == "OPEN" && isUserRequester && (
            <CloseMergeRequestDialog
              mergeRequestId={request.id}
              boardId={request.boardId}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
