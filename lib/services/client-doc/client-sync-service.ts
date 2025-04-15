"use client";
import { IClientSyncService, StorageConfig } from "./types";
import {
  Repo,
  AnyDocumentId,
  DocHandle,
  PeerId,
  NetworkAdapterInterface,
  DocHandleEphemeralMessagePayload,
  Change,
  Doc,
  DocumentId,
  getAllChanges,
} from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { UserStatusPayload } from "@/types/userStatusPayload";
import {
  applyChanges,
  clone,
  getChanges,
  getHeads,
  merge,
} from "@automerge/automerge";
import { ServerRepoFactory } from "@/lib/utils/server-repo-factory";
/**
 * Service for synchronizing local documents with the server
 * Manages online/offline state and document synchronization
 */
export class ClientSyncService implements IClientSyncService {
  private readonly docId: string;
  private repo: Repo;
  private readonly websocketURL: string;
  private networkAdapter: BrowserWebSocketClientAdapter;
  private readonly peerId: PeerId;
  private readonly DISABLE_RETRY_INTERVAL = 10_000_000;
  private handle: DocHandle<LayerSchema>;
  private serverRepoFactory: ServerRepoFactory;

  /**
   * Creates a new ClientSyncService
   * @param docId The ID of the document to sync
   */
  constructor({
    docId,
    storageConfig,
  }: {
    docId: string;
    storageConfig?: StorageConfig;
  }) {
    this.docId = docId;
    this.websocketURL = NEXT_PUBLIC_WEBSOCKET_URL;
    this.networkAdapter = new BrowserWebSocketClientAdapter(
      this.websocketURL,
      this.DISABLE_RETRY_INTERVAL
    );
    this.peerId = uuidv4() as PeerId;
    this.repo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(
        storageConfig?.database,
        storageConfig?.store
      ),
      peerId: this.peerId,
    });
    this.handle = this.repo.find<LayerSchema>(this.docId as AnyDocumentId);
    this.serverRepoFactory = new ServerRepoFactory();
  }

  /**
   * Initializes the local repository
   * Creates or loads an existing document
   */
  public async initializeRepo(): Promise<DocHandle<LayerSchema>> {
    try {
      this.disconnect();

      const handle = this.repo.find<LayerSchema>(this.docId as AnyDocumentId);
      await handle.whenReady(["unavailable", "requesting", "ready"]);

      if (handle.state == "ready") {
        return handle;
      } else {
        // document not present in storage
        await this.connect();
        await handle.whenReady();
        return handle;
      }
    } catch (error) {
      console.error("Could not find or create local doc. Reason:", error);
      throw new Error(`Local doc could not be initialized: ${error}`);
    }
  }

  public async getHandle(): Promise<DocHandle<LayerSchema>> {
    const handle = this.repo.find<LayerSchema>(this.docId as AnyDocumentId);
    await handle.whenReady();
    return handle;
  }

  /**
   * Generic method to compare collections using frequency counting
   * @param collection1 - First collection
   * @param collection2 - Second collection
   * @param getKey - Function to get a string key from an item
   * @param allowSubset - If true, collection2 can be a subset of collection1
   * @returns boolean indicating if collections match according to criteria
   */
  private compareCollections<T>(
    collection1: T[],
    collection2: T[],
    getKey: (item: T) => string,
    allowSubset: boolean = false
  ): boolean {
    if (collection1 === collection2) return true;
    if (collection2.length === 0) return true;
    if (!allowSubset && collection1.length !== collection2.length) return false;
    if (allowSubset && collection1.length < collection2.length) return false;

    const counts = new Map<string, number>();

    for (const item of collection1) {
      const key = getKey(item);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    for (const item of collection2) {
      const key = getKey(item);
      const count = counts.get(key);

      if (count === undefined) return false;

      if (count === 1) {
        counts.delete(key);
      } else {
        counts.set(key, count - 1);
      }
    }

    return allowSubset || counts.size === 0;
  }

  /**
   * Checks if two arrays contain exactly the same elements, regardless of order
   * @param array1 - First array to compare
   * @param array2 - Second array to compare
   * @returns boolean indicating if arrays contain the same elements
   */
  private areArraysEqual(array1: string[], array2: string[]): boolean {
    if (!array1.length && !array2.length) return true;
    return (
      this.compareCollections(array1, array2, (item) => item) &&
      this.compareCollections(array2, array1, (item) => item)
    );
  }

  /**
   * Checks if all changes in array2 are present in array1
   * @param array1 - First array to compare
   * @param array2 - Second array to compare
   * @returns boolean indicating if array1 contains all changes in array2
   */
  private containsAllChanges(array1: Change[], array2: Change[]): boolean {
    return this.compareCollections(
      array1,
      array2,
      (change) => Array.from(change).join(","),
      true
    );
  }

  /**
   * Gets document heads from a document handle
   * @param docHandle - Document handle to get heads from
   * @returns Promise resolving to array of document heads
   */
  private async getDocumentHeads(
    docHandle: DocHandle<LayerSchema>
  ): Promise<string[]> {
    const doc = await docHandle.doc();
    return getHeads(doc);
  }

  /**
   * Checks if the client can connect to the server by comparing local and server document states
   * @returns Promise resolving to boolean indicating if connection is possible
   */
  public async canConnect(): Promise<boolean> {
    if (this.isConnected()) return true;

    const { repo: serverRepo, cleanup } =
      this.serverRepoFactory.createManagedRepo();

    try {
      const serverDocHandle = serverRepo.find<LayerSchema>(
        this.docId as AnyDocumentId
      );
      const serverDoc = await serverDocHandle.doc();
      const localDoc = await this.handle.doc();

      const serverChanges = await getAllChanges(serverDoc);
      const localChanges = await getAllChanges(localDoc);

      if (localChanges.length > serverChanges.length) {
        return false;
      }

      if (localChanges.length === serverChanges.length) {
        const serverHeads = await this.getDocumentHeads(serverDocHandle);
        const localHeads = await this.getDocumentHeads(this.handle);
        return this.areArraysEqual(localHeads, serverHeads);
      }
      return this.containsAllChanges(serverChanges, localChanges);
    } catch (error) {
      console.error("Failed to check if repo can connect", error);
      return false;
    } finally {
      cleanup();
    }
  }

  public getRepo(): Repo {
    return this.repo;
  }

  /**
   * Connects to the server with improved error handling and safety checks
   * Creates a new network adapter if needed
   * @throws Error if connection fails
   */
  public async connect(): Promise<void> {
    if (this.isConnected()) {
      console.debug("Already connected to server");
      return;
    }
    try {
      if (!this.websocketURL) {
        throw new Error("WebSocket URL is not configured");
      }
      this.networkAdapter = new BrowserWebSocketClientAdapter(
        this.websocketURL,
        this.DISABLE_RETRY_INTERVAL
      );
      this.repo.networkSubsystem.addNetworkAdapter(
        this.networkAdapter as unknown as NetworkAdapterInterface
      );
      await this.repo.networkSubsystem.whenReady();
      console.debug("Successfully connected to server");
    } catch (error) {
      console.error("Failed to connect to server:", error);
      throw new Error(
        `Failed to connect to server: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  /**
   * Disconnects from the server
   */
  public disconnect(): void {
    if (!this.isConnected()) return;

    try {
      this.networkAdapter.disconnect();
      // @ts-ignore
      this.networkAdapter.emit("close");
      if (
        this.networkAdapter.socket?.readyState === WebSocket.OPEN ||
        this.networkAdapter.socket?.readyState === WebSocket.CONNECTING
      ) {
        this.networkAdapter.socket.close();
      }
    } catch (error) {
      console.error("Error disconnecting from server", error);
    }
  }

  /**
   * Gets the document ID
   * @returns The document ID
   */
  public getDocId(): string {
    return this.docId;
  }

  public getDocUrl(): string {
    return `automerge:${this.docId}`;
  }

  /**
   * Sets the online state
   * @param online Whether the client is online
   */
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
      await this.getHandle();
      const activeUsers: Set<string> = new Set();

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanupAndResolve();
        }, 2500);

        const handleEphemeralMessage = (
          event: DocHandleEphemeralMessagePayload<UserStatusPayload>
        ) => {
          try {
            const [userId, state] = event.message as [string, unknown];
            if (userId) {
              activeUsers.add(userId);
            }
          } catch (error) {
            console.error("Error processing user status message:", error);
          }
        };

        const cleanupAndResolve = () => {
          clearTimeout(timeoutId);
          this.handle.removeListener("ephemeral-message");
          resolve(Array.from(activeUsers));
        };

        this.handle.on("ephemeral-message", handleEphemeralMessage);
      });
    } catch (error) {
      console.error("Error getting active users:", error);
      return [];
    }
  }

  /**
   * Deletes a document from the repository
   */
  public deleteDoc(): void {
    this.repo.delete(this.docId as AnyDocumentId);
  }

  /**
   * Gets the server version of the document
   * @param docId The ID of the document to get
   * @returns The server document
   */
  public async getServerDoc(docId?: string): Promise<Doc<LayerSchema> | null> {
    const { repo: serverRepo, cleanup } =
      this.serverRepoFactory.createManagedRepo();

    try {
      const serverHandle = serverRepo.find<LayerSchema>(
        docId ? (docId as AnyDocumentId) : (this.docId as AnyDocumentId)
      );
      await serverHandle.whenReady();
      return await serverHandle.doc();
    } catch (error) {
      console.error("Error getting server doc:", error);
      return null;
    } finally {
      cleanup();
    }
  }

  /**
   * Gets the result of merging local and server documents
   * @returns An object containing the merged document and changes, or null values if merge cannot be performed
   * @throws Error if there are issues accessing local or server documents
   */
  public async getLocalMergePreview(): Promise<{
    doc: Doc<LayerSchema> | null;
    changes: Change[] | null;
  }> {
    try {
      const localHandle = await this.getHandle();
      const localDoc = await localHandle.doc();

      if (!localDoc) {
        return { doc: null, changes: null };
      }

      const serverDoc = await this.getServerDoc();

      if (!serverDoc) {
        return { doc: null, changes: null };
      }

      const serverDocCopy = clone(serverDoc);
      const mergedDoc = merge(serverDocCopy, localDoc);
      const changes = getChanges(serverDocCopy, mergedDoc);

      return { doc: mergedDoc, changes };
    } catch (error) {
      console.error("Error during document merge:", error);
      return { doc: null, changes: null };
    }
  }

  public async getMergeRequestPreview(
    changes: Change[]
  ): Promise<Doc<LayerSchema> | null> {
    try {
      const serverDoc = await this.getServerDoc();
      if (!serverDoc) {
        return null;
      }
      const serverDocCopy = clone(serverDoc);
      const doc2 = applyChanges(serverDocCopy, changes)[0];
      return doc2;
    } catch (error) {
      console.error("Error during document merge:", error);
      return null;
    }
  }

  /**
   * Removes the local document from the IndexedDB
   */
  public async removeLocalDoc(): Promise<void> {
    this.repo.storageSubsystem!.removeDoc(this.docId as DocumentId);
  }

  public isConnected(): boolean {
    return (
      this.networkAdapter.socket?.readyState === WebSocket.OPEN ||
      this.networkAdapter.socket?.readyState === WebSocket.CONNECTING
    );
  }
}
