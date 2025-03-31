import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { useState, useRef, useEffect } from "react";
import * as automerge from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Change, Doc } from "@automerge/automerge";
import { PreviewHeader } from "@/components/preview/preview-header";
import { ClientSyncContext } from "@/components/board/context/client-doc-context";
import { TeamService } from "@/lib/services/team/team-service";
import { BoardHeader } from "@/components/board/components/board-header";
import BoardReadonly from "@/components/preview/board-readonly";
import { MergeRequestService } from "@/lib/services/merge-request/merge-request-service";
import { getSession } from "next-auth/react";
import { withTeamRolePage } from "@/lib/middleware/with-team-role-page";

interface BoardPreviewPageProps {
  board: string;
  team: string;
  mergeRequestId: string;
}

export default function BoardPreviewPage({
  board,
  team,
  mergeRequestId,
}: BoardPreviewPageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedTeam = JSON.parse(team);
  const [isMounted, setIsMounted] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Doc<LayerSchema>>();
  const clientSyncServiceRef = useRef<ClientSyncService | null>(null);
  const [localChanges, setLocalChanges] = useState<Change[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (!clientSyncServiceRef.current) {
      clientSyncServiceRef.current = new ClientSyncService({
        docUrl: parsedBoard.docUrl,
      });
    }
    const fetchLocalChanges = async () => {
      if (!clientSyncServiceRef.current) return;

      const localChanges = await clientSyncServiceRef.current.getLocalChanges();
      setLocalChanges(localChanges);
      const serverDoc = await clientSyncServiceRef.current.getServerDoc();
      const serverDocCopy = automerge.clone(serverDoc);
      const doc2 = automerge.applyChanges(serverDocCopy, localChanges)[0];
      setPreviewDoc(doc2);
    };

    fetchLocalChanges();
  }, [parsedBoard.docUrl]);

  if (!isMounted) {
    return null;
  }

  return (
    <ClientSyncContext.Provider
      value={{ clientSyncService: clientSyncServiceRef.current }}
    >
      <BoardHeader
        boardName={parsedBoard.name}
        teamName={parsedTeam.name}
        teamId={parsedTeam.id}
      />
      <PreviewHeader
        boardId={parsedBoard.id}
        localChanges={localChanges}
        mergeRequestId={mergeRequestId}
      />
      {previewDoc && <BoardReadonly doc={previewDoc} />}
    </ClientSyncContext.Provider>
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
  if (!board || !board.docUrl) {
    return {
      notFound: true,
    };
  }
  const team = await TeamService.getTeamById(board.teamId);
  if (!team) {
    return {
      notFound: true,
    };
  }

  const mergeRequest = await MergeRequestService.getRequesterMergeRequest(
    boardId,
    session.user.id
  );
  return {
    props: {
      board: JSON.stringify(board),
      team: JSON.stringify(team),
      mergeRequestId: mergeRequest ? mergeRequest.id : null,
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
