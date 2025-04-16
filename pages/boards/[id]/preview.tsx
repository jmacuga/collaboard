import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { useState, useRef, useEffect } from "react";
import * as automerge from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Change, Doc } from "@automerge/automerge";
import { PreviewHeader } from "@/components/preview/preview-header";
import { TeamService } from "@/lib/services/team/team-service";
import { BoardHeader } from "@/components/board/components/board-header";
import BoardReadonly from "@/components/preview/board-readonly";
import { getSession } from "next-auth/react";
import { withTeamRolePage } from "@/lib/middleware/with-team-role-page";
import { CollaborationClientContext } from "@/components/board/context/collaboration-client-context";
import TeamArchived from "@/components/teams/team-archived";
import BoardArchived from "@/components/boards/board-archived";
import { toast } from "sonner";
import { CollaborationClient } from "@/lib/sync/collaboration-client";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
interface BoardPreviewPageProps {
  board: string;
  team: string;
  isAdmin: boolean;
}

export default function BoardPreviewPage({
  board,
  team,
  isAdmin,
}: BoardPreviewPageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedTeam = JSON.parse(team);
  if (parsedTeam.archived) {
    return <TeamArchived />;
  }
  if (parsedBoard.archived) {
    return <BoardArchived />;
  }
  const [isMounted, setIsMounted] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Doc<LayerSchema>>();
  const collaborationClientRef = useRef<CollaborationClient | null>(null);
  const [localChanges, setLocalChanges] = useState<Change[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (!collaborationClientRef.current) {
      collaborationClientRef.current = new CollaborationClient(
        parsedBoard.automergeDocId,
        NEXT_PUBLIC_WEBSOCKET_URL
      );
    }
    const fetchLocalChanges = async () => {
      if (!collaborationClientRef.current) return;

      const { doc, changes } =
        await collaborationClientRef.current.getLocalMergePreview();

      if (!doc || !changes) {
        toast.error("Error fetching merge request preview");
        return;
      }
      setLocalChanges(changes);
      setPreviewDoc(doc);
    };

    fetchLocalChanges();
  }, [parsedBoard.docId]);

  if (!isMounted) {
    return null;
  }

  return (
    <CollaborationClientContext.Provider
      value={{ collaborationClient: collaborationClientRef.current }}
    >
      <BoardHeader
        boardName={parsedBoard.name}
        teamName={parsedTeam.name}
        teamId={parsedTeam.id}
      />
      <PreviewHeader
        boardId={parsedBoard.id}
        localChanges={localChanges}
        docId={parsedBoard.docId}
        isAdmin={isAdmin}
      />
      {previewDoc && <BoardReadonly doc={previewDoc} />}
    </CollaborationClientContext.Provider>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async ({ req, params }) => {
  const boardId = params?.id as string;
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const board = await BoardService.getBoardById(boardId);
  if (!board || !board.automergeDocId) {
    return {
      notFound: true,
    };
  }
  const isAdmin =
    (await TeamService.getUserTeamRole(session.user.id, board.teamId)) ==
    "Admin";
  const team = await TeamService.getTeamById(board.teamId);
  if (!team) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      board: JSON.stringify(board),
      team: JSON.stringify(team),
      isAdmin,
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
