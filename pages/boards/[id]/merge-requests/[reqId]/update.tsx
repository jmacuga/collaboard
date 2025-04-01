import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { withTeamRolePage } from "@/lib/middleware";
import { TeamService } from "@/lib/services/team/team-service";
import { MergeRequestService } from "@/lib/services/merge-request";
import { useEffect, useRef, useState } from "react";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import * as automerge from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import {
  AnyDocumentId,
  DocHandle,
  NetworkAdapterInterface,
  Repo,
} from "@automerge/automerge-repo";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { MergeRequestUpdateProvider } from "@/components/merge-requests/merge-request-update-provider";
import { getSession } from "next-auth/react";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
interface MergeRequestUpdatePageProps {
  board: string;
  team: string;
  changes: string;
}

export default function UpdateMergeRequestPage({
  board,
  team,
  changes,
}: MergeRequestUpdatePageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedTeam = JSON.parse(team);
  const parsedChanges = JSON.parse(changes);
  const decodedChanges = parsedChanges.map(
    (change: string) => new Uint8Array(Buffer.from(change, "base64"))
  );
  return (
    <MergeRequestUpdateProvider
      board={parsedBoard}
      team={parsedTeam}
      changes={decodedChanges}
    />
  );
}

const getServerSidePropsFunc: GetServerSideProps = async ({ req, params }) => {
  const boardId = params?.id as string;
  const reqId = params?.reqId as string;
  const result = await MergeRequestService.getMergeRequestById(reqId);
  if (!result) {
    return {
      notFound: true,
    };
  }
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const { mergeRequest, changes } = result;
  const isUserRequester = mergeRequest.requesterId === session.user.id;
  if (!isUserRequester) {
    return {
      notFound: true,
    };
  }
  const changesString = changes.map((change: Uint8Array) =>
    Buffer.from(change).toString("base64")
  );
  const board = await BoardService.getBoardById(boardId);
  if (!board) {
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
      changes: JSON.stringify(changesString),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
