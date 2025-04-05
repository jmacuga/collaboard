"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-sync-service";
import { ClientSyncContext } from "@/components/board/context/client-sync-context";
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
import clientGetServerRepo from "@/lib/utils/clientGetServerRepo";

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
  const [clientSyncService, setClientSyncService] =
    useState<ClientSyncService | null>(null);
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

      setClientSyncService(
        new ClientSyncService({
          docId: docId,
        })
      );
      setUpdateDocId(docId);
      initialLoad.current = false;
    }

    return () => {
      if (clientSyncService) {
        clientSyncService.deleteDoc();
      }
    };
  }, [updateDocId]);

  useEffect(() => {
    const applyChangesToUpdateDoc = async () => {
      if (initialLoad.current || !clientSyncService) return;
      const serverRepo = clientGetServerRepo();
      const serverDoc = await serverRepo
        .find<LayerSchema>(board.automergeDocId as AnyDocumentId)
        .doc();
      const docHandle = await clientSyncService
        .getRepo()
        ?.find<LayerSchema>(updateDocId as AnyDocumentId);
      docHandle?.update((doc) => {
        doc = automerge.merge(doc, serverDoc);
        return automerge.applyChanges(doc, changes)[0];
      });
    };

    applyChangesToUpdateDoc();
  }, [clientSyncService]);

  if (!clientSyncService) {
    return <div>Loading board...</div>;
  }

  return (
    <NetworkStatusProvider>
      <RepoContext.Provider value={clientSyncService.getRepo()}>
        <ClientSyncContext.Provider value={{ clientSyncService }}>
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
        </ClientSyncContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
