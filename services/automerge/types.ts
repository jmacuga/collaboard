import { Repo, DocHandle } from "@automerge/automerge-repo";
import KonvaNodeSchema from "@/types/KonvaNodeSchema";
import { ClientSyncStatus } from "../sync/types";
import { Doc } from "@automerge/automerge";
/**
 * Interface for the Automerge service
 * @template T - The type of the data to be stored in the Automerge document
 */
export interface IAutomergeService<T extends object> {
  createServerDoc(): string;
  connectOrCreateLocalDoc(docUrl?: string | null): string;
  getLocalRepo(): Repo;
  getServerRepo(): Repo;
  //   getDocUrl(): string | null;
  //   getLocalHandle(): DocHandle<T> | null;
  //   getLocalDocUrl(): string | null;
  //   getServerHandle(): DocHandle<KonvaNodeSchema> | null;
  //   getServerDocUrl(): string | null;
  //   getSyncStatus(): ClientSyncStatus;
  //   onStatusChange(callback: (status: ClientSyncStatus) => void): void;
  //   updateLocalDoc(): null;
  //   updateServerDoc(): null;
  //   getIsLocalSynced(): boolean;
  //   getMergeResult(): Doc<KonvaNodeSchema>;
  //   getNewLocalChanges(): Uint8Array[];
  //   getAllServerChanges(): Uint8Array[];
  // connectToServer(docUrl: string): void;
  //   disconnectFromServer(): void;
  //   applyLocalChanges(changes: Uint8Array[]): void;
}
