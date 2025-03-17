"use client";
import { IClientSyncService } from "./types";
import {
  Repo,
  AnyDocumentId,
  DocHandle,
  PeerId,
} from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
import { db } from "@/lib/indexed-db";
import { v4 as uuidv4 } from "uuid";

export class ClientSyncService implements IClientSyncService {
  docUrl: string;
  repo: Repo | null;
  websocketURL: string;
  networkAdapter: BrowserWebSocketClientAdapter;
  peerId: PeerId;
  connected: boolean;

  constructor({ docUrl }: { docUrl: string }) {
    this.docUrl = docUrl;
    this.repo = null;
    this.websocketURL = NEXT_PUBLIC_WEBSOCKET_URL;
    this.networkAdapter = new BrowserWebSocketClientAdapter(
      this.websocketURL,
      10000000
    );
    this.peerId = uuidv4() as PeerId;
    this.connected = false;
  }

  async initializeRepo(): Promise<void> {
    if (this.repo) {
      return;
    }
    this.repo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
      peerId: this.peerId,
    });
    let localDocHandle;

    try {
      const docExists = await this.docExistsInIndexedDB();
      if (docExists === true) {
        this.disconnect();
        localDocHandle = this.repo?.find(this.docUrl as AnyDocumentId);
      } else {
        console.log("Creating local doc");
        this.connect();
        localDocHandle = await this.repo?.find(this.docUrl as AnyDocumentId);
        await this.addUrlToIndexedDB();
      }
    } catch (error) {
      console.error("Could not find or create local doc. Reason:", error);
    }
    if (!localDocHandle) {
      throw new Error("Local doc could not be initialized");
    }
  }

  async docExistsInIndexedDB(): Promise<boolean | undefined> {
    const docExists = await db.docUrls.get(this.docUrl);
    return docExists && docExists.docUrl === this.docUrl;
  }

  async addUrlToIndexedDB(): Promise<void> {
    console.log("Adding url to indexedDB", this.docUrl);
    await db.docUrls.add({ docUrl: this.docUrl });
  }

  async removeUrlFromIndexedDB(): Promise<void> {
    console.log("Removing url from indexedDB", this.docUrl);
    await db.docUrls.delete(this.docUrl);
  }

  canConnect(): boolean {
    // Can connect if localDoc is not ahead of serverDoc
    return true;
  }

  async connect(): Promise<void> {
    if (this.connected) {
      console.log("Already connected to server");
      return;
    }
    if (!this.repo) {
      throw new Error("Local repo is not initialized");
    }
    console.log("Connecting to server");
    if (this.networkAdapter.socket?.readyState !== WebSocket.OPEN) {
      this.networkAdapter = new BrowserWebSocketClientAdapter(
        this.websocketURL,
        10000000
      );
      this.repo.networkSubsystem.addNetworkAdapter(this.networkAdapter);
    } else {
      console.log("Already connected to server");
    }
    this.connected = true;
  }

  disconnect(): void {
    if (!this.connected) {
      console.log("Already disconnected from server");
      return;
    }
    this.networkAdapter.disconnect();
    if (this.networkAdapter.socket?.readyState === WebSocket.OPEN) {
      this.networkAdapter.socket?.close();
      console.log("Disconnected from server");
    }
    this.connected = false;
  }

  getDocUrl(): string {
    return this.docUrl;
  }

  updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  async syncLocalRepo(): Promise<void> {
    const serverRepo = new Repo({
      network: [new BrowserWebSocketClientAdapter(this.websocketURL)],
    });
    const serverDoc = serverRepo.find(this.docUrl as AnyDocumentId);
    if (!serverDoc) {
      throw new Error("Server doc is not initialized");
    }
    await serverDoc.whenReady();
    const localDoc = this.repo?.find(this.docUrl as AnyDocumentId);
    if (!localDoc) {
      throw new Error("Local doc is not initialized");
    }
    await localDoc.whenReady();
    localDoc.merge(serverDoc);
    console.log("Local doc merged with server doc");
    await localDoc.whenReady();
  }

  setOnline(online: boolean): void {
    if (!this.repo) {
      throw new Error("Local repo is not initialized");
    }
    if (online) {
      this.connect();
    } else {
      this.disconnect();
    }
  }

  deleteDoc(): void {
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

  sendEphemeralMessage(message: any) {
    const docHandle = this.repo?.find(this.docUrl as AnyDocumentId);
    if (docHandle) {
      docHandle.broadcast(message);
    }
  }

  onEphemeralMessage(callback: (message: any) => void) {
    const docHandle = this.repo?.find(this.docUrl as AnyDocumentId);
    if (docHandle) {
      return docHandle.on("ephemeral-message", callback);
    }
    return () => {};
  }
}
