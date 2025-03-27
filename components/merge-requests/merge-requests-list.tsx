import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReviewRequest, User } from "@prisma/client";
import { MergeRequest } from "@prisma/client";
import { Button } from "../ui/button";
import Link from "next/link";

interface ReviewRequestWithReviewer extends ReviewRequest {
  reviewer: User;
}

interface MergeRequestExtended extends MergeRequest {
  reviewRequests: ReviewRequestWithReviewer[];
  requester: User;
}

interface MergeRequestsListProps {
  mergeRequests: MergeRequestExtended[];
}

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  MERGED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const MergeRequestsList = ({ mergeRequests }: MergeRequestsListProps) => {
  if (!mergeRequests.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No merge requests found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Reviewers</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergeRequests.map((request) => (
            <TableRow
              key={request.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => {}}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                }
              }}
            >
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
                  <span className="text-sm text-gray-500">
                    No reviewers assigned
                  </span>
                )}
              </TableCell>
              <TableCell>
                {new Date(request.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(request.updatedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/boards/${request.boardId}/merge-requests/${request.id}`}
                >
                  <Button variant="outline">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MergeRequestsList;
