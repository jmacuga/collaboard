"use client";
import { IClientSyncService } from "./types";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { Repo, AnyDocumentId, DocHandle } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
import { db } from "@/lib/indexed-db";

export class ClientSyncService implements IClientSyncService {
  docUrl: string;
  serverRepo: Repo | null;
  localRepo: Repo | null;
  websocketURL: string;
  localNetworkAdapter: BrowserWebSocketClientAdapter;

  constructor({ docUrl }: { docUrl: string }) {
    this.docUrl = docUrl;
    this.serverRepo = null;
    this.localRepo = null;
    this.websocketURL = NEXT_PUBLIC_WEBSOCKET_URL;
    this.localNetworkAdapter = new BrowserWebSocketClientAdapter(
      this.websocketURL
    );
  }

  async initializeRepo(): Promise<void> {
    this.serverRepo = new Repo({
      network: [new BrowserWebSocketClientAdapter(this.websocketURL)],
    });
    this.localRepo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
    });
    let localDocHandle;

    try {
      const docExists = await db.docUrls.get(this.docUrl);
      if (docExists && docExists.docUrl === this.docUrl) {
        console.log("Found doc in indexedDB", docExists);
        localDocHandle = this.localRepo.find(this.docUrl as AnyDocumentId);
      } else {
        console.log("Creating local doc");
        localDocHandle = await this.createLocalDocFromServerDoc();
        await db.docUrls.add({ docUrl: this.docUrl });
      }
    } catch (error) {
      console.error("Could not find or create local doc. Reason:", error);
    }
    if (!localDocHandle) {
      throw new Error("Local doc could not be initialized");
    }
  }

  async createLocalDocFromServerDoc(): Promise<DocHandle<KonvaNodeSchema> | null> {
    try {
      if (!this.localRepo || !this.serverRepo) {
        throw new Error("Local repo or server repo is not initialized");
      }
      this.localRepo.networkSubsystem.addNetworkAdapter(
        this.localNetworkAdapter
      );
      await this.localRepo.networkSubsystem.whenReady();
      const localDocHandle = this.localRepo.find(this.docUrl as AnyDocumentId);
      await localDocHandle.whenReady();
      this.localNetworkAdapter.disconnect();
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

  connect(): void {
    if (!this.localRepo) {
      throw new Error("Local repo is not initialized");
    }
    this.localNetworkAdapter = new BrowserWebSocketClientAdapter(
      this.websocketURL
    );
    this.localRepo.networkSubsystem.addNetworkAdapter(this.localNetworkAdapter);
  }

  disconnect(): void {
    this.localNetworkAdapter.disconnect();
  }

  getDocUrl(): string {
    return this.docUrl;
  }

  updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  deleteDoc(): void {
    this.serverRepo.delete(this.docUrl as AnyDocumentId);
    this.localRepo.delete(this.docUrl as AnyDocumentId);
  }
}
