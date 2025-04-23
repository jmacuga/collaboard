import {
  Doc,
  Change,
  DocHandle,
  Repo,
  AnyDocumentId,
  PeerId,
  DocumentId,
} from "@automerge/automerge-repo";
import { StageSchema } from "@/types/stage-schema";
import { StorageConfig } from "./types";
import { getLocalMergePreview, getMergeRequestPreview } from "./synchronizer";
import { UserPresenceMonitor } from "./user-presence-monitor";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { v4 as uuidv4 } from "uuid";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { NetworkAdapterInterface } from "@automerge/automerge-repo";

class MergeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MergeError";
  }
}

export class CollaborationClient {
  private readonly docId: string;
  private repo: Repo;
  private websocketURL: string;
  private websocketAdapter: BrowserWebSocketClientAdapter;
  private presenceMonitor: UserPresenceMonitor;
  private readonly DISABLE_RETRY_INTERVAL = 10_000_000;

  constructor(
    docId: string,
    websocketUrl: string,
    storageConfig?: StorageConfig
  ) {
    this.docId = docId;
    this.repo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(
        storageConfig?.database,
        storageConfig?.store
      ),
      peerId: this.generatePeerId() as PeerId,
    });
    this.presenceMonitor = new UserPresenceMonitor();
    this.websocketURL = websocketUrl;
    this.websocketAdapter = new BrowserWebSocketClientAdapter(
      this.websocketURL,
      this.DISABLE_RETRY_INTERVAL
    );
  }

  public async initialize(): Promise<DocHandle<StageSchema>> {
    try {
      this.disconnect();
      const handle = await this.getHandle();
      await handle.whenReady(["unavailable", "requesting", "ready"]);

      if (handle.state === "ready") {
        return handle;
      } else {
        await this.connect();
        await handle.whenReady();
        return handle;
      }
    } catch (error) {
      throw new Error(`Initialization failed: ${error}`);
    }
  }

  public async getHandle(): Promise<DocHandle<StageSchema>> {
    return this.repo.find<StageSchema>(this.docId as AnyDocumentId);
  }

  public getRepo(): Repo {
    return this.repo;
  }

  public async canConnect(): Promise<boolean> {
    if (this.isSocketActive()) return true;
    const localHandle = await this.getHandle();
    const localDoc = await localHandle.doc();
    const { changes } = await getLocalMergePreview<StageSchema>({
      localDoc,
      docId: this.docId,
    });
    if (changes === null) throw new MergeError("Error getting merge preview");
    if (changes && changes.length > 0) return false;
    return true;
  }

  public async connect(): Promise<void> {
    if (this.isSocketActive()) return;
    try {
      this.websocketAdapter = new BrowserWebSocketClientAdapter(
        this.websocketURL,
        this.DISABLE_RETRY_INTERVAL
      );
      this.repo.networkSubsystem.addNetworkAdapter(
        this.websocketAdapter as unknown as NetworkAdapterInterface
      );
      await this.repo.networkSubsystem.whenReady();
    } catch (error) {
      throw new Error(`Connection failed: ${error}`);
    }
  }

  public disconnect(): void {
    try {
      if (this.isSocketActive()) {
        this.websocketAdapter.disconnect();
      }
      this.websocketAdapter.socket?.close();
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  }

  private isSocketActive(): boolean {
    return (
      this.websocketAdapter.socket?.readyState === WebSocket.OPEN ||
      this.websocketAdapter.socket?.readyState === WebSocket.CONNECTING
    );
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
    this.repo.delete(this.docId as AnyDocumentId);
  }

  public async getLocalMergePreview(): Promise<{
    doc: Doc<StageSchema> | null;
    changes: Change[] | null;
  }> {
    const localHandle = await this.getHandle();
    const localDoc = await localHandle.doc();
    if (!localDoc) {
      return { doc: null, changes: null };
    }
    return getLocalMergePreview({
      localDoc: localDoc,
      docId: this.docId,
    });
  }

  public async getMergeRequestPreview(
    changes: Change[]
  ): Promise<Doc<StageSchema> | null> {
    return getMergeRequestPreview(changes, this.docId);
  }

  public async removeLocalDoc(): Promise<void> {
    this.repo.storageSubsystem!.removeDoc(this.docId as DocumentId);
  }

  public isConnected(): boolean {
    return this.isSocketActive();
  }

  /**
   * Initializes the repository and returns the document handle
   * @deprecated Use initialize() instead
   */
  public async initializeRepo(): Promise<DocHandle<StageSchema>> {
    return this.initialize();
  }

  private generatePeerId(): PeerId {
    return uuidv4() as PeerId;
  }
}
