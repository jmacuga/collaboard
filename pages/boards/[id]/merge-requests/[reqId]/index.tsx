import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { useState, useRef, useEffect } from "react";
import * as automerge from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Doc } from "@automerge/automerge";
import { ClientSyncContext } from "@/components/board/context/client-doc-context";
import { TeamService } from "@/lib/services/team/team-service";
import { BoardHeader } from "@/components/board/components/board-header";
import { MergeRequestService } from "@/lib/services/merge-request/merge-request-service";
import { MergeRequestHeader } from "@/components/preview/merge-request-header";
import BoardReadonly from "@/components/preview/board-readonly";

interface MergeRequestPageProps {
  board: string;
  team: string;
  mergeRequest: string;
  changes: string;
}

export default function MergeRequestPage({
  board,
  team,
  mergeRequest,
  changes,
}: MergeRequestPageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedMergeRequest = JSON.parse(mergeRequest);
  const parsedChanges = JSON.parse(changes);
  const parsedTeam = JSON.parse(team);
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
        docUrl: parsedBoard.docUrl,
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
      <MergeRequestHeader
        boardId={parsedBoard.id}
        teamId={parsedTeam.id}
        boardName={parsedBoard.name}
        teamName={parsedTeam.name}
        mergeRequest={parsedMergeRequest}
        onAccept={() => Promise.resolve()}
        onReject={() => Promise.resolve()}
      />
      {previewDoc && <BoardReadonly doc={previewDoc} />}
    </ClientSyncContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const boardId = params?.id as string;
  const reqId = params?.reqId as string;
  const result = await MergeRequestService.getMergeRequestById(reqId);
  if (!result) {
    return {
      notFound: true,
    };
  }
  const { mergeRequest, changes } = result;
  const changesString = changes.map((change: Uint8Array) =>
    Buffer.from(change).toString("base64")
  );
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
  return {
    props: {
      board: JSON.stringify(board),
      team: JSON.stringify(team),
      mergeRequest: JSON.stringify(mergeRequest),
      changes: JSON.stringify(changesString),
    },
  };
};
