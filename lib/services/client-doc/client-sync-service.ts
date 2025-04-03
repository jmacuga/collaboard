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
import { db } from "@/lib/indexed-db";
import { v4 as uuidv4 } from "uuid";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { UserStatusPayload } from "@/types/userStatusPayload";
import { getChanges, getHeads } from "@automerge/automerge";
/**
 * Service for synchronizing local documents with the server
 * Manages online/offline state and document synchronization
 */
export class ClientSyncService implements IClientSyncService {
  private readonly docUrl: string;
  private repo: Repo;
  private readonly websocketURL: string;
  private networkAdapter: BrowserWebSocketClientAdapter;
  private readonly peerId: PeerId;
  private connected: boolean;
  private readonly DISABLE_RETRY_INTERVAL = 10_000_000;

  /**
   * Creates a new ClientSyncService
   * @param docUrl The URL of the document to sync
   */
  constructor({
    docUrl,
    storageConfig,
  }: {
    docUrl: string;
    storageConfig?: StorageConfig;
  }) {
    this.docUrl = docUrl;
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
  }

  /**
   * Initializes the local repository
   * Creates or loads an existing document
   */
  public async initializeRepo(): Promise<DocHandle<LayerSchema> | null> {
    try {
      const docExists = await this.docExistsInIndexedDB();

      if (docExists) {
        try {
          this.disconnect();
          const handle = await this.findLocalDoc();
          return handle;
        } catch (error) {
          console.log("Could not find local doc. Creating new from server");
          await this.connect();
          const handle = await this.findLocalDoc();
          return handle;
        }
      } else {
        console.log("Creating local doc");
        await this.connect();
        const handle = await this.findLocalDoc();
        await this.addUrlToIndexedDB();
        return handle;
      }
    } catch (error) {
      console.error("Could not find or create local doc. Reason:", error);
      throw new Error(`Local doc could not be initialized: ${error}`);
    }
  }

  /**
   * Finds a local document by URL
   * @returns The document handle
   */
  private async findLocalDoc(): Promise<DocHandle<LayerSchema>> {
    const docHandle = this.repo.find<LayerSchema>(this.docUrl as AnyDocumentId);
    await docHandle.whenReady();
    return docHandle;
  }

  /**
   * Checks if a document exists in IndexedDB
   * @returns Whether the document exists
   */
  private async docExistsInIndexedDB(): Promise<boolean> {
    const docExists = await db.docUrls.get(this.docUrl);
    return !!docExists && docExists.docUrl === this.docUrl;
  }

  /**
   * Adds a document URL to IndexedDB
   */
  private async addUrlToIndexedDB(): Promise<void> {
    await db.docUrls.add({ docUrl: this.docUrl });
  }

  /**
   * Removes a document URL from IndexedDB
   */
  private async removeUrlFromIndexedDB(): Promise<void> {
    await db.docUrls.delete(this.docUrl);
  }

  /**
   * Checks if two arrays contain exactly the same elements, regardless of order
   * @param array1 - First array to compare
   * @param array2 - Second array to compare
   * @returns boolean indicating if arrays contain the same elements
   */
  private areArraysEqual(array1: string[], array2: string[]): boolean {
    if (!array1.length || !array2.length || array1.length !== array2.length) {
      return false;
    }
    const set = new Set(array1);
    return (
      array2.every((element) => set.has(element)) &&
      array1.every((element) => set.has(element))
    );
  }

  /**
   * Creates a server repository instance
   * @returns Repo instance configured for server connection
   */
  public createServerRepo(): Repo {
    return new Repo({
      network: [
        new BrowserWebSocketClientAdapter(
          this.websocketURL
        ) as any as NetworkAdapterInterface,
      ],
    });
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
   * @throws Error if document handles cannot be initialized
   */
  public async canConnect(): Promise<boolean> {
    try {
      this.disconnect();

      const localDocHandle = this.repo.find<LayerSchema>(
        this.docUrl as AnyDocumentId
      );
      await localDocHandle.whenReady();
      const serverRepo = this.createServerRepo();
      const serverDocHandle = serverRepo.find<LayerSchema>(
        this.docUrl as AnyDocumentId
      );
      const serverDoc = await serverDocHandle.doc();
      const localDoc = await localDocHandle.doc();

      const serverChanges = await getAllChanges(serverDoc);
      const localChanges = await getAllChanges(localDoc);

      if (localChanges.length > serverChanges.length) {
        return false;
      }

      if (localChanges.length == serverChanges.length) {
        const localHeads = await this.getDocumentHeads(localDocHandle);
        const serverHeads = await this.getDocumentHeads(serverDocHandle);
        const headsEqual = this.areArraysEqual(localHeads, serverHeads);
        return headsEqual;
      }

      return true;
    } catch (error) {
      console.error("Failed to check connection status:", error);
      return false;
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
    if (this.connected) {
      console.log("Already connected to server");
      return;
    }

    console.log("Connecting to server");

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
    } else {
      console.log("Already connected to server");
    }

    this.connected = true;
  }

  /**
   * Disconnects from the server
   */
  public disconnect(): void {
    if (!this.connected) {
      console.log("Already disconnected from server");
      return;
    }

    try {
      this.networkAdapter.disconnect();
      // @ts-ignore
      this.networkAdapter.emit("close");
    } catch (error) {
      console.error("Error disconnecting from server", error);
    }

    if (this.networkAdapter.socket?.readyState === WebSocket.OPEN) {
      this.networkAdapter.socket.close();
      console.log("Disconnected from server");
    }

    this.connected = false;
  }

  /**
   * Gets the document URL
   * @returns The document URL
   */
  public getDocUrl(): string {
    return this.docUrl;
  }

  /**
   * Updates server data
   * @param docUrl The URL of the document to update
   */
  public updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
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

      const handle = this.repo.find<LayerSchema>(this.docUrl as AnyDocumentId);
      await handle.whenReady();

      const activeUsers: Set<string> = new Set();

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanupAndResolve();
        }, 5000);

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
          handle.off("ephemeral-message", handleEphemeralMessage);
          resolve(Array.from(activeUsers));
        };

        handle.on("ephemeral-message", handleEphemeralMessage);
      });
    } catch (error) {
      console.error("Error getting active users:", error);
      return [];
    }
  }

  /**
   * Deletes a document
   */
  public deleteDoc(): void {
    this.repo.delete(this.docUrl as AnyDocumentId);
    this.removeUrlFromIndexedDB();
  }

  public async getServerChanges(): Promise<Change[]> {
    const localDocHandle = this.repo.find<LayerSchema>(
      this.docUrl as AnyDocumentId
    );
    await localDocHandle.whenReady();
    const localDoc = await localDocHandle.doc();
    const serverDoc = await this.getServerDoc();
    const changes = getChanges(localDoc, serverDoc);
    return changes;
  }

  public async getLocalChanges(): Promise<Change[]> {
    const localDocHandle = this.repo.find<LayerSchema>(
      this.docUrl as AnyDocumentId
    );
    await localDocHandle.whenReady();
    const localDoc = await localDocHandle.doc();
    const serverDoc = await this.getServerDoc();
    const changes = getChanges(serverDoc, localDoc);
    return changes;
  }

  public async getServerDoc(docUrl?: string): Promise<Doc<LayerSchema>> {
    const serverRepo = this.createServerRepo();
    const serverDoc = serverRepo.find<LayerSchema>(
      docUrl ? (docUrl as AnyDocumentId) : (this.docUrl as AnyDocumentId)
    );
    await serverDoc.whenReady();
    return await serverDoc.doc();
  }

  public async revertLocalChanges(): Promise<void> {
    const docId = this.docUrl.split(":")[1];
    this.repo.storageSubsystem!.removeDoc(docId as DocumentId);
    this.removeUrlFromIndexedDB();
  }
}
