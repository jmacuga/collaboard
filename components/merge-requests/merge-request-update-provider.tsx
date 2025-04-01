"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { ClientSyncContext } from "@/components/board/context/client-doc-context";
import { BoardContextProvider } from "@/components/board/context/board-context";
import { Team as PrismaTeam, Board as PrismaBoard } from "@prisma/client";
import { LayerSchema } from "@/types/KonvaNodeSchema";

import { AnyDocumentId, Repo } from "@automerge/automerge-repo";
import { MergeRequestUpdateHeader } from "./merge-request-update-header";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import * as automerge from "@automerge/automerge";

interface MergeRequestUpdateProviderState {
  clientSyncService: ClientSyncService | null;
}

export function MergeRequestUpdateProvider({
  board,
  team,
  changes,
}: {
  board: PrismaBoard;
  team: PrismaTeam;
  changes: Uint8Array[];
}) {
  const [state, setState] = useState<MergeRequestUpdateProviderState>({
    clientSyncService: null,
  });
  const megedDocUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!megedDocUrlRef.current) {
      console.log("Creating new merged doc");
      const repo = new Repo({
        storage: new IndexedDBStorageAdapter(),
      });
      const docHandle = repo.create<LayerSchema>();
      megedDocUrlRef.current = docHandle.documentId as string;
      setState({
        clientSyncService: new ClientSyncService({
          docUrl: megedDocUrlRef.current as string,
        }),
      });
    }

    return () => {
      if (state.clientSyncService) {
        console.log("Deleting merged doc");
        state.clientSyncService?.deleteDoc();
      }
    };
  }, [megedDocUrlRef.current]);

  useEffect(() => {
    if (!state.clientSyncService) return;
    console.log("Getting merged doc");
    const getMergedDoc = async () => {
      if (!state.clientSyncService) return;
      const serverRepo = state.clientSyncService.createServerRepo();
      console.log("Getting server doc");
      const serverDoc = await serverRepo
        .find<LayerSchema>(board.docUrl as AnyDocumentId)
        .doc();
      console.log("Server doc", serverDoc);
      const repo = state.clientSyncService.getRepo();
      if (!repo) return;
      const mergedDocHandle = repo.find<LayerSchema>(
        megedDocUrlRef.current as AnyDocumentId
      );

      mergedDocHandle.update((doc) => {
        doc = automerge.merge(doc, serverDoc);
        return automerge.applyChanges(doc, changes)[0];
      });
    };

    getMergedDoc();
  }, [state.clientSyncService]);

  if (!state.clientSyncService) {
    return <div>Loading board...</div>;
  }

  return (
    <RepoContext.Provider value={state.clientSyncService.getRepo()}>
      <ClientSyncContext.Provider
        value={{ clientSyncService: state.clientSyncService }}
      >
        <BoardContextProvider syncedInitial={true}>
          <div className="flex flex-col h-screen">
            <MergeRequestUpdateHeader
              boardName={board.name}
              teamName={team.name}
              teamId={team.id}
            />
            <Board team={team} board={board} hideActiveUsers={true} />
          </div>
        </BoardContextProvider>
      </ClientSyncContext.Provider>
    </RepoContext.Provider>
  );
}
