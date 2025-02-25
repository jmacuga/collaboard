"use client";
import { IClientSyncService } from "./types";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
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
  serverRepo: Repo | null;
  localRepo: Repo | null;
  websocketURL: string;
  localNetworkAdapter: BrowserWebSocketClientAdapter;
  peerId: PeerId;

  constructor({ docUrl }: { docUrl: string }) {
    this.docUrl = docUrl;
    this.serverRepo = null;
    this.localRepo = null;
    this.websocketURL = NEXT_PUBLIC_WEBSOCKET_URL;
    this.localNetworkAdapter = new BrowserWebSocketClientAdapter(
      this.websocketURL,
      10000000
    );
    this.peerId = uuidv4() as PeerId;
  }

  async initializeRepo(): Promise<void> {
    this.serverRepo = new Repo({
      network: [new BrowserWebSocketClientAdapter(this.websocketURL)],
    });
    this.localRepo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
      peerId: this.peerId,
    });
    let localDocHandle;

    try {
      const docExists = await this.docExistsInIndexedDB();
      if (docExists === true) {
        console.log("Found doc in indexedDB", docExists);
        localDocHandle = await this.getDocFromIndexedDB();
      } else {
        console.log("Creating local doc");
        localDocHandle = await this.createLocalDocFromServerDoc();
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

  async getDocFromIndexedDB(): Promise<DocHandle<LayerSchema> | undefined> {
    return this.localRepo?.find(this.docUrl as AnyDocumentId);
  }

  async addUrlToIndexedDB(): Promise<void> {
    console.log("Adding url to indexedDB", this.docUrl);
    await db.docUrls.add({ docUrl: this.docUrl });
  }

  async createLocalDocFromServerDoc(): Promise<DocHandle<LayerSchema> | null> {
    try {
      if (!this.localRepo || !this.serverRepo) {
        throw new Error("Local repo or server repo is not initialized");
      }
      this.connect();
      const localDocHandle = this.localRepo.find(this.docUrl as AnyDocumentId);
      await localDocHandle.whenReady();
      this.disconnect();
      return localDocHandle;
    } catch (error) {
      console.error("Error creating local doc from server doc", error);
      return null;
    }
  }

  canConnect(): boolean {
    // Can connect if localDoc is not ahead of serverDoc
    return true;
  }

  async connect(): Promise<void> {
    if (!this.localRepo) {
      throw new Error("Local repo is not initialized");
    }
    console.log("Connecting to server");
    if (this.localNetworkAdapter.socket?.readyState !== WebSocket.OPEN) {
      this.localNetworkAdapter = new BrowserWebSocketClientAdapter(
        this.websocketURL,
        10000000
      );
      this.localRepo.networkSubsystem.addNetworkAdapter(
        this.localNetworkAdapter
      );
    } else {
      console.log("Already connected to server");
    }
  }

  disconnect(): void {
    this.localNetworkAdapter.disconnect();
    this.localNetworkAdapter.socket?.close();
    console.log("Disconnected from server");
  }

  getDocUrl(): string {
    return this.docUrl;
  }

  updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  async syncLocalRepo(): Promise<void> {
    const serverDoc = this.serverRepo?.find(this.docUrl as AnyDocumentId);
    if (!serverDoc) {
      throw new Error("Server doc is not initialized");
    }
    await serverDoc.whenReady();
    const localDoc = this.localRepo?.find(this.docUrl as AnyDocumentId);
    if (!localDoc) {
      throw new Error("Local doc is not initialized");
    }
    await localDoc.whenReady();
    localDoc.merge(serverDoc);
    console.log("Local doc merged with server doc");
    await localDoc.whenReady();
  }

  setOnline(online: boolean): void {
    if (!this.localRepo) {
      throw new Error("Local repo is not initialized");
    }
    if (online) {
      this.connect();
    } else {
      this.disconnect();
    }
  }

  deleteDoc(): void {
    this.serverRepo?.delete(this.docUrl as AnyDocumentId);
    this.localRepo?.delete(this.docUrl as AnyDocumentId);
  }
}
