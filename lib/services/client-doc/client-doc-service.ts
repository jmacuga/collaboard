"use client";
import { IClientSyncService } from "./types";
import {
  Repo,
  AnyDocumentId,
  DocHandle,
  PeerId,
  NetworkAdapterInterface,
  DocHandleEphemeralMessagePayload,
} from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
import { db } from "@/lib/indexed-db";
import { v4 as uuidv4 } from "uuid";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { UserStatusPayload } from "@/types/userStatusPayload";
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
  constructor({ docUrl }: { docUrl: string }) {
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
      storage: new IndexedDBStorageAdapter(),
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
        this.disconnect();
        const handle = await this.findLocalDoc();
        return handle;
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
    console.log("Adding url to indexedDB", this.docUrl);
    await db.docUrls.add({ docUrl: this.docUrl });
  }

  /**
   * Removes a document URL from IndexedDB
   */
  private async removeUrlFromIndexedDB(): Promise<void> {
    console.log("Removing url from indexedDB", this.docUrl);
    await db.docUrls.delete(this.docUrl);
  }

  /**
   * Checks if the client can connect to the server
   * @returns Whether the client can connect
   */
  public canConnect(): boolean {
    // Can connect if localDoc is not ahead of serverDoc
    // This is a placeholder - actual implementation would need to check
    // if there are local changes that conflict with server changes
    return true;
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
   * Creates a local document from a server document
   * @returns The document handle
   */
  public async createLocalDocFromServerDoc(): Promise<DocHandle<LayerSchema> | null> {
    try {
      if (!this.repo) {
        await this.initializeRepo();
      }

      const serverRepo = new Repo({
        network: [
          new BrowserWebSocketClientAdapter(
            this.websocketURL
          ) as any as NetworkAdapterInterface,
        ],
      });

      const serverDoc = serverRepo.find<LayerSchema>(
        this.docUrl as AnyDocumentId
      );
      await serverDoc.whenReady();

      const localDoc = this.repo!.find<LayerSchema>(
        this.docUrl as AnyDocumentId
      );
      await localDoc.whenReady();

      await localDoc.merge(serverDoc);
      console.log("Server doc copied to local doc");

      await this.addUrlToIndexedDB();

      return localDoc;
    } catch (error) {
      console.error("Error creating local doc from server doc:", error);
      return null;
    }
  }

  /**
   * Synchronizes the local repository with the server
   */
  public async syncLocalRepo(): Promise<void> {
    try {
      const serverRepo = new Repo({
        network: [
          new BrowserWebSocketClientAdapter(
            this.websocketURL
          ) as any as NetworkAdapterInterface,
        ],
      });

      const serverDoc = serverRepo.find<LayerSchema>(
        this.docUrl as AnyDocumentId
      );

      if (!serverDoc) {
        throw new Error("Server doc is not initialized");
      }

      await serverDoc.whenReady();

      if (!this.repo) {
        throw new Error("Local repo is not initialized");
      }

      const localDoc = this.repo.find<LayerSchema>(
        this.docUrl as AnyDocumentId
      );

      if (!localDoc) {
        throw new Error("Local doc is not initialized");
      }

      await localDoc.whenReady();

      await localDoc.merge(serverDoc);
      console.log("Local doc merged with server doc");
    } catch (error) {
      console.error("Error syncing local repo:", error);
      throw error;
    }
  }

  /**
   * Sets the online state
   * @param online Whether the client is online
   */
  public setOnline(online: boolean): void {
    if (!this.repo) {
      throw new Error("Local repo is not initialized");
    }

    if (online) {
      this.connect();
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
    if (!this.repo) {
      this.repo = new Repo({
        network: [],
        storage: new IndexedDBStorageAdapter(),
        peerId: this.peerId,
      });
    }

    this.repo.delete(this.docUrl as AnyDocumentId);
    this.removeUrlFromIndexedDB();
  }
}
