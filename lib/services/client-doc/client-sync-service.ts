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
import { getChanges, getHeads, getMissingDeps } from "@automerge/automerge";
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
  private connected: boolean;
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
    this.connected = false;
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
  public async initializeRepo(): Promise<DocHandle<LayerSchema> | null> {
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
   * Checks if two arrays contain exactly the same elements, regardless of order
   * @param array1 - First array to compare
   * @param array2 - Second array to compare
   * @returns boolean indicating if arrays contain the same elements
   */
  private areArraysEqual(array1: string[], array2: string[]): boolean {
    if (array1 === array2) return true;
    if (!array1.length && !array2.length) return true;
    if (array1.length !== array2.length) return false;
    const counts = new Map<string, number>();

    for (const item of array1) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }

    for (const item of array2) {
      const count = counts.get(item);
      if (count === undefined) return false;

      if (count === 1) {
        counts.delete(item);
      } else {
        counts.set(item, count - 1);
      }
    }
    return counts.size === 0;
  }

  /**
   * Checks if all changes in array2 are present in array1
   * @param array1 - First array to compare
   * @param array2 - Second array to compare
   * @returns boolean indicating if array1 contains all changes in array2
   */
  private containsAllChanges(array1: Change[], array2: Change[]): boolean {
    if (array1 === array2) return true;
    if (array2.length === 0) return true;
    if (array1.length < array2.length) return false;

    const hashChange = (change: Change): string => {
      return Array.from(change).join(",");
    };

    const hashMap = new Map<string, number>();

    for (const change of array1) {
      const hash = hashChange(change);
      hashMap.set(hash, (hashMap.get(hash) || 0) + 1);
    }
    for (const change of array2) {
      const hash = hashChange(change);
      const count = hashMap.get(hash);

      if (count === undefined) {
        return false;
      }

      if (count === 1) {
        hashMap.delete(hash);
      } else {
        hashMap.set(hash, count - 1);
      }
    }

    return true;
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
    if (this.connected) return true;

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

  public getRepo(): Repo | null {
    return this.repo;
  }

  /**
   * Connects to the server
   * Creates a new network adapter if needed
   */
  public async connect(): Promise<void> {
    if (this.connected) return;

    if (
      this.networkAdapter.socket?.readyState !== WebSocket.OPEN &&
      this.networkAdapter.socket?.readyState !== WebSocket.CONNECTING
    ) {
      this.networkAdapter = new BrowserWebSocketClientAdapter(
        this.websocketURL,
        this.DISABLE_RETRY_INTERVAL
      );
      this.repo.networkSubsystem.addNetworkAdapter(
        this.networkAdapter as any as NetworkAdapterInterface
      );
    }

    this.connected = true;
  }

  /**
   * Disconnects from the server
   */
  public disconnect(): void {
    if (!this.connected) return;

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

    this.connected = false;
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
  public async getServerDoc(docId?: string): Promise<Doc<LayerSchema>> {
    const { repo: serverRepo, cleanup } =
      this.serverRepoFactory.createManagedRepo();

    try {
      const serverHandle = serverRepo.find<LayerSchema>(
        docId ? (docId as AnyDocumentId) : (this.docId as AnyDocumentId)
      );
      await serverHandle.whenReady();
      return await serverHandle.doc();
    } finally {
      cleanup();
    }
  }

  /**
   * Removes the local document from the IndexedDB
   */
  public async removeLocalDoc(): Promise<void> {
    this.repo.storageSubsystem!.removeDoc(this.docId as DocumentId);
  }

  public isConnected(): boolean {
    return this.connected;
  }
}
