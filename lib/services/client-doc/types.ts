import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Change, Doc, DocHandle, Repo } from "@automerge/automerge-repo";

export interface IClientSyncService {
  initializeRepo(): Promise<DocHandle<LayerSchema>>;
  getDocId(): string;
  setOnline(online: boolean): void;
  canConnect(): Promise<boolean>;
  getRepo(): Repo;
  connect(): void;
  disconnect(): void;
  setOnline(online: boolean): void;
  getActiveUsers(): Promise<string[]>;
  deleteDoc(): void;
  getServerDoc(docId?: string): Promise<Doc<LayerSchema>>;
  removeLocalDoc(): Promise<void>;
  isConnected(): boolean;
  getLocalMergePreview(): Promise<{
    doc: Doc<LayerSchema> | null;
    changes: Change[] | null;
  }>;
  getMergeRequestPreview(changes: Change[]): Promise<Doc<LayerSchema> | null>;
}

export interface StorageConfig {
  database: string;
  store: string;
}
