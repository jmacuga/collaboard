"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import Board from "@/components/board/board";
import { CollaborationClient } from "@/lib/sync/collaboration-client";
import { CollaborationClientContext } from "@/components/board/context/collaboration-client-context";
import { BoardContextProvider } from "@/components/board/context/board-context";
import { Team as PrismaTeam, Board as PrismaBoard } from "@prisma/client";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { AnyDocumentId, Repo } from "@automerge/automerge-repo";
import { MergeRequestUpdateHeader } from "./update-header";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import * as automerge from "@automerge/automerge";
import { BoardHeader } from "../board/components/board-header";
import { useRouter } from "next/router";
import { NetworkStatusProvider } from "../providers/network-status-provider";
import { ServerRepoFactory } from "@/lib/utils/server-repo-factory";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
export function MergeRequestUpdateContent({
  board,
  team,
  changes,
}: {
  board: PrismaBoard;
  team: PrismaTeam;
  changes: Uint8Array[];
}) {
  const router = useRouter();
  const initialLoad = useRef(true);
  const [collaborationClient, setCollaborationClient] =
    useState<CollaborationClient | null>(null);
  const [updateDocId, setUpdateDocId] = useState<string | null>(
    router.query.updateDocId as string
  );

  useEffect(() => {
    if (initialLoad.current) {
      let docId = updateDocId;
      if (!docId) {
        const repo = new Repo({
          storage: new IndexedDBStorageAdapter(),
        });
        const docHandle = repo.create<LayerSchema>();
        docId = docHandle.documentId as string;
      }

      setCollaborationClient(
        new CollaborationClient(docId, NEXT_PUBLIC_WEBSOCKET_URL)
      );
      setUpdateDocId(docId);
      initialLoad.current = false;
    }

    return () => {
      if (collaborationClient) {
        collaborationClient.deleteDoc();
      }
    };
  }, [updateDocId]);

  useEffect(() => {
    const applyChangesToUpdateDoc = async () => {
      if (initialLoad.current || !collaborationClient) return;
      const { repo: serverRepo, cleanup } =
        new ServerRepoFactory().createManagedRepo();
      const serverDoc = await serverRepo
        .find<LayerSchema>(board.automergeDocId as AnyDocumentId)
        .doc();
      const docHandle = await collaborationClient
        .getRepo()
        ?.find<LayerSchema>(updateDocId as AnyDocumentId);
      docHandle?.update((doc) => {
        doc = automerge.merge(doc, serverDoc);
        return automerge.applyChanges(doc, changes)[0];
      });
      cleanup();
    };

    applyChangesToUpdateDoc();
  }, [collaborationClient]);

  if (!collaborationClient) {
    return <div>Loading board...</div>;
  }

  return (
    <NetworkStatusProvider>
      <RepoContext.Provider value={collaborationClient.getRepo()}>
        <CollaborationClientContext.Provider
          value={{ collaborationClient: collaborationClient }}
        >
          <BoardContextProvider syncedInitial={true}>
            <div className="flex flex-col h-screen">
              <BoardHeader
                boardName={board.name}
                teamName={team.name}
                teamId={team.id}
              />
              <MergeRequestUpdateHeader
                boardId={board.id}
                serverDocId={board.automergeDocId as string}
              />
              <Board team={team} board={board} hideActiveUsers={true} />
            </div>
          </BoardContextProvider>
        </CollaborationClientContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
