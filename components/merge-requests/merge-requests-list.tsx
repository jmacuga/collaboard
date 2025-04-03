import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReviewRequest, User } from "@prisma/client";
import { MergeRequest } from "@prisma/client";
import MergeRequestsRow from "./merge-requests-row";
import { useSession } from "next-auth/react";

interface MergeRequestsListProps {
  mergeRequests: MergeRequestExtended[];
}

type MergeRequestExtended = MergeRequest & {
  reviewRequests: ReviewRequest & { reviewer: User }[];
  requester: User;
};

const MergeRequestsList = ({ mergeRequests }: MergeRequestsListProps) => {
  const session = useSession();
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
            <MergeRequestsRow
              key={request.id}
              request={request}
              isUserRequester={request.requesterId === session.data?.user.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MergeRequestsList;
