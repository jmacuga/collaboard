import { GetServerSideProps } from "next";
import { withTeamRolePage } from "@/lib/middleware";
import { AppLayout } from "@/components/layouts/app-layout";
import { BoardService } from "@/lib/services/board/board-service";
import { TeamService } from "@/lib/services/team/team-service";
import MergeRequestsList from "@/components/merge-requests/merge-requests-list";

interface MergeRequestsPageProps {
  board: string;
  mergeRequests: string;
  team: string;
}

export default function MergeRequestsPage({
  board,
  mergeRequests,
  team,
}: MergeRequestsPageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedMergeRequests = JSON.parse(mergeRequests);
  const parsedTeam = JSON.parse(team);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {parsedTeam.name} - {parsedBoard.name} - Merge Requests
            </h1>
          </div>

          <MergeRequestsList mergeRequests={parsedMergeRequests} />
        </div>
      </div>
    </AppLayout>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async (context) => {
  const boardId = context.params?.id as string;
  const board = await BoardService.getBoardById(boardId);
  const team = await TeamService.getTeamById(board?.teamId as string);
  const mergeRequests = await BoardService.getMergeRequests(boardId);
  return {
    props: {
      board: JSON.stringify(board),
      mergeRequests: JSON.stringify(mergeRequests),
      team: JSON.stringify(team),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
