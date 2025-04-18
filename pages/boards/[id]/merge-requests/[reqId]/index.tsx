import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { ClientSyncService } from "@/lib/services/client-doc/client-sync-service";
import { useState, useRef, useEffect } from "react";
import * as automerge from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Doc } from "@automerge/automerge";
import { ClientSyncContext } from "@/components/board/context/client-sync-context";
import { TeamService } from "@/lib/services/team/team-service";
import { BoardHeader } from "@/components/board/components/board-header";
import { MergeRequestService } from "@/lib/services/merge-request/merge-request-service";
import { MergeRequestHeader } from "@/components/merge-requests/merge-request-header";
import BoardReadonly from "@/components/preview/board-readonly";
import { getSession } from "next-auth/react";
import { withTeamRolePage } from "@/lib/middleware/with-team-role-page";
import BoardArchived from "@/components/boards/board-archived";
import TeamArchived from "@/components/teams/team-archived";
interface MergeRequestPageProps {
  board: string;
  team: string;
  mergeRequest: string;
  changes: string;
  isUserReviewer: boolean;
  isUserRequester: boolean;
}

export default function MergeRequestPage({
  board,
  team,
  mergeRequest,
  changes,
  isUserReviewer,
  isUserRequester,
}: MergeRequestPageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedMergeRequest = JSON.parse(mergeRequest);
  const parsedChanges = JSON.parse(changes);
  const parsedTeam = JSON.parse(team);
  if (parsedBoard.archived) {
    return <BoardArchived />;
  }
  if (parsedTeam.archived) {
    return <TeamArchived />;
  }
  const decodedChanges = parsedChanges.map(
    (change: string) => new Uint8Array(Buffer.from(change, "base64"))
  );

  const clientSyncServiceRef = useRef<ClientSyncService | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Doc<LayerSchema>>();

  useEffect(() => {
    setIsMounted(true);
    if (!clientSyncServiceRef.current) {
      clientSyncServiceRef.current = new ClientSyncService({
        docId: parsedBoard.automergeDocId,
      });
    }
    const getPreviewDoc = async () => {
      if (!clientSyncServiceRef.current) return;
      const serverDoc = await clientSyncServiceRef.current.getServerDoc();
      const serverDocCopy = automerge.clone(serverDoc);
      const doc2 = automerge.applyChanges(serverDocCopy, decodedChanges)[0];
      setPreviewDoc(doc2);
    };

    getPreviewDoc();
  }, [parsedBoard.automergeDocId]);

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
      <MergeRequestHeader
        mergeRequest={parsedMergeRequest}
        isUserReviewer={isUserReviewer}
        isUserRequester={isUserRequester}
      />
      {previewDoc && <BoardReadonly doc={previewDoc} />}
    </ClientSyncContext.Provider>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async ({ req, params }) => {
  const boardId = params?.id as string;
  const reqId = params?.reqId as string;
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const result = await MergeRequestService.getMergeRequestById(reqId);
  if (!result) {
    return {
      notFound: true,
    };
  }
  const { mergeRequest, changes } = result;
  const isUserReviewer = mergeRequest.reviewRequests.some(
    (reviewRequest) => reviewRequest.reviewerId === session.user.id
  );
  const isUserRequester = mergeRequest.requesterId === session.user.id;
  const changesString = changes.map((change: Uint8Array) =>
    Buffer.from(change).toString("base64")
  );
  const board = await BoardService.getBoardById(boardId);
  if (!board || !board.automergeDocId) {
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
  if (team.archived) {
    return {
      redirect: {
        destination: "/teams",
        permanent: false,
      },
    };
  }
  return {
    props: {
      board: JSON.stringify(board),
      team: JSON.stringify(team),
      mergeRequest: JSON.stringify(mergeRequest),
      changes: JSON.stringify(changesString),
      isUserReviewer,
      isUserRequester,
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
