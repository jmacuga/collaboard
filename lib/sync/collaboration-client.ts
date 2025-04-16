import {
  Doc,
  Change,
  DocHandle,
  Repo,
  AnyDocumentId,
} from "@automerge/automerge-repo";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { StorageConfig } from "./types";
import { DocumentManager } from "./document-manager";
import { NetworkManager } from "./network-manager";
import { DocumentSynchronizer } from "./document-synchronizer";
import { UserPresenceMonitor } from "./user-presence-monitor";

export class CollaborationClient {
  private readonly docId: string;
  private documentManager: DocumentManager;
  private networkManager: NetworkManager;
  private documentSynchronizer: DocumentSynchronizer;
  private presenceMonitor: UserPresenceMonitor;

  constructor(
    docId: string,
    websocketUrl: string,
    storageConfig?: StorageConfig
  ) {
    this.docId = docId;
    this.documentManager = new DocumentManager(docId, storageConfig);
    this.networkManager = new NetworkManager(websocketUrl);
    this.documentSynchronizer = new DocumentSynchronizer();
    this.presenceMonitor = new UserPresenceMonitor();
  }

  public async initialize(): Promise<DocHandle<LayerSchema>> {
    try {
      this.networkManager.disconnect();
      const handle = await this.documentManager.getHandle();
      await handle.whenReady(["unavailable", "requesting", "ready"]);

      if (handle.state === "ready") {
        return handle;
      } else {
        await this.networkManager.connect(this.documentManager.getRepo());
        await handle.whenReady();
        return handle;
      }
    } catch (error) {
      throw new Error(`Initialization failed: ${error}`);
    }
  }

  public async getHandle(): Promise<DocHandle<LayerSchema>> {
    return this.documentManager.getHandle();
  }

  public getRepo(): Repo {
    return this.documentManager.getRepo();
  }

  public async canConnect(): Promise<boolean> {
    if (this.isConnected()) return true;
    const localHandle = await this.documentManager.getHandle();
    const localDoc = await localHandle.doc();
    return this.documentSynchronizer.canSync(localDoc, this.docId);
  }

  public async connect(): Promise<void> {
    await this.networkManager.connect(this.documentManager.getRepo());
  }

  public disconnect(): void {
    this.networkManager.disconnect();
  }

  public getDocId(): string {
    return this.docId;
  }

  public getDocUrl(): string {
    return `automerge:${this.docId}`;
  }

  public async setOnline(online: boolean): Promise<void> {
    if (online) {
      await this.connect();
    } else {
      this.disconnect();
    }
  }

  public async getActiveUsers(): Promise<string[]> {
    try {
      await this.connect();
      const handle = await this.getHandle();
      return this.presenceMonitor.getActiveUsers(handle);
    } catch (error) {
      console.error("Error getting active users:", error);
      return [];
    }
  }

  public deleteDoc(): void {
    this.documentManager.deleteDoc();
  }

  public async getServerDoc(docId?: string): Promise<Doc<LayerSchema> | null> {
    return this.documentSynchronizer.getServerDoc(docId || this.docId);
  }

  public async getLocalMergePreview(): Promise<{
    doc: Doc<LayerSchema> | null;
    changes: Change[] | null;
  }> {
    const localHandle = await this.documentManager.getHandle();
    const localDoc = await localHandle.doc();
    if (!localDoc) {
      return { doc: null, changes: null };
    }
    return this.documentSynchronizer.getLocalMergePreview({
      localDoc: localDoc,
      docId: this.docId,
    });
  }

  public async getMergeRequestPreview(
    changes: Change[]
  ): Promise<Doc<LayerSchema> | null> {
    return this.documentSynchronizer.getMergeRequestPreview(
      changes,
      this.docId
    );
  }

  public async removeLocalDoc(): Promise<void> {
    await this.documentManager.removeLocalDocument();
  }

  public isConnected(): boolean {
    return this.networkManager.isConnected();
  }

  /**
   * Initializes the repository and returns the document handle
   * @deprecated Use initialize() instead
   */
  public async initializeRepo(): Promise<DocHandle<LayerSchema>> {
    return this.initialize();
  }
}
