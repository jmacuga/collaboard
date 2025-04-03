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

export function MergeRequestUpdateProvider({
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
  const [updateDocUrl, setUpdateDocUrl] = useState<string | null>(
    router.query.updateDocUrl as string
  );

  useEffect(() => {
    if (initialLoad.current) {
      let docUrl = updateDocUrl;
      if (!docUrl) {
        const repo = new Repo({
          storage: new IndexedDBStorageAdapter(),
        });
        const docHandle = repo.create<LayerSchema>();
        docUrl = docHandle.documentId as string;
      }

      setClientSyncService(
        new ClientSyncService({
          docUrl: docUrl,
        })
      );
      setUpdateDocUrl(docUrl);
      initialLoad.current = false;
    }

    return () => {
      if (clientSyncService) {
        clientSyncService.deleteDoc();
      }
    };
  }, [updateDocUrl]);

  useEffect(() => {
    const applyChangesToUpdateDoc = async () => {
      if (initialLoad.current || !clientSyncService) return;
      const serverRepo = clientSyncService.createServerRepo();
      const serverDoc = await serverRepo
        .find<LayerSchema>(board.docUrl as AnyDocumentId)
        .doc();
      const docHandle = await clientSyncService
        .getRepo()
        ?.find<LayerSchema>(updateDocUrl as AnyDocumentId);
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
                serverDocUrl={board.docUrl as string}
              />
              <Board team={team} board={board} hideActiveUsers={true} />
            </div>
          </BoardContextProvider>
        </ClientSyncContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
