import { GetServerSideProps } from "next";
import { BoardCards } from "@/components/boards/board-cards";
import { getSession } from "next-auth/react";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { TeamService } from "@/lib/services/team/team-service";
import { withTeamRolePage } from "@/lib/middleware";
import TeamBreadcrumb from "@/components/boards/breadcrumb";
import { TeamNav } from "@/components/teams/team-nav";
import TeamArchived from "@/components/teams/team-archived";
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
  if (parsedTeam.archived) {
    return <TeamArchived />;
  }
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <TeamBreadcrumb team={parsedTeam} />
        <h1 className="text-3xl font-bold">{parsedTeam.name} - Boards</h1>
      </div>
      <div className="flex justify-between items-center mb-8">
        <TeamNav teamId={parsedTeam.id as string} />
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

  const team = await TeamService.getTeamById(teamId);

  if (!team) {
    return {
      notFound: true,
    };
  }

  const boards = await TeamService.getTeamBoards(teamId);

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
