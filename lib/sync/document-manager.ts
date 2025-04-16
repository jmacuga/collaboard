import {
  DocHandle,
  Repo,
  AnyDocumentId,
  PeerId,
  DocumentId,
} from "@automerge/automerge-repo";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { StorageConfig } from "@/lib/sync/types";
import { v4 as uuidv4 } from "uuid";

export class DocumentManager {
  private docId: string;
  private repo: Repo;

  constructor(docId: string, storageConfig?: StorageConfig) {
    this.docId = docId;
    this.repo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(
        storageConfig?.database,
        storageConfig?.store
      ),
      peerId: this.generatePeerId() as PeerId,
    });
  }

  public getHandle(): DocHandle<LayerSchema> {
    return this.repo.find<LayerSchema>(this.docId as AnyDocumentId);
  }

  public getRepo(): Repo {
    return this.repo;
  }

  private generatePeerId(): string {
    return uuidv4();
  }

  public async removeLocalDocument(): Promise<void> {
    this.repo.storageSubsystem!.removeDoc(this.docId as DocumentId);
  }

  public deleteDoc(): void {
    this.repo.delete(this.docId as AnyDocumentId);
  }
}
