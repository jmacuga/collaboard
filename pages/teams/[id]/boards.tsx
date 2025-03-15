import { GetServerSideProps } from "next";
import { getTeamBoards, getTeam } from "@/db/data";
import { BoardCards } from "@/components/boards/board-cards";
import { getSession } from "next-auth/react";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { TeamService } from "@/lib/services/team/team-service";
import { withTeamRolePage } from "@/lib/middleware";
interface BoardsPageProps {
  boards: string;
  team: string;
  userRole: string;
}

export default function BoardsPage({
  boards,
  team,
  userRole,
}: BoardsPageProps) {
  const parsedBoards = JSON.parse(boards);
  const parsedTeam = JSON.parse(team);
  const parsedUserRole = JSON.parse(userRole);
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{parsedTeam.name} - Boards</h1>
        <CreateBoardDialog teamId={parsedTeam.id as string} />
      </div>

      {parsedBoards && (
        <BoardCards teamBoards={parsedBoards} userRole={parsedUserRole} />
      )}
    </div>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const teamId = context.params?.id as string;
  const userRole = await TeamService.getUserTeamRole(session!.user.id, teamId);

  const team = await getTeam(teamId);

  if (!team) {
    return {
      notFound: true,
    };
  }

  const boards = await getTeamBoards(teamId);

  return {
    props: {
      boards: JSON.stringify(boards),
      team: JSON.stringify(team),
      userRole: JSON.stringify(userRole),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "team",
  role: ["Admin", "Member"],
});
