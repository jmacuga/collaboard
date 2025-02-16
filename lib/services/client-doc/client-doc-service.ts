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
  serverRepo: Repo;
  localRepo: Repo;
  websocketURL: string;

  private constructor({
    docUrl,
    serverRepo,
    localRepo,
    websocketURL,
  }: {
    docUrl: string;
    serverRepo: Repo;
    localRepo: Repo;
    websocketURL: string;
  }) {
    this.docUrl = docUrl;
    this.serverRepo = serverRepo;
    this.localRepo = localRepo;
    this.websocketURL = websocketURL;
  }

  static async create(docUrl: string): Promise<ClientSyncService> {
    const websocketURL = NEXT_PUBLIC_WEBSOCKET_URL;
    const serverRepo = new Repo({
      network: [new BrowserWebSocketClientAdapter(websocketURL)],
    });
    const localRepo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
    });
    let localDocHandle;
    try {
      const docExists = await db.docUrls.get(docUrl);
      if (docExists) {
        console.log("Found doc in indexedDB", docExists);
        localDocHandle = localRepo.find(docUrl as AnyDocumentId);
      } else {
        console.log("Creating local doc");
        localDocHandle = await ClientSyncService.createLocalDocFromServerDoc(
          localRepo,
          serverRepo,
          docUrl
        );
        await db.docUrls.add({ docUrl: docUrl });
      }
    } catch (error) {
      console.error("Could not find or create local doc. Reason:", error);
    }
    if (!localDocHandle) {
      throw new Error("Local doc could not be initialized");
    }
    return new ClientSyncService({
      docUrl: docUrl,
      serverRepo: serverRepo,
      localRepo: localRepo,
      websocketURL: websocketURL,
    });
  }
  /*
  This function creates a local doc from a server doc.
  It clones the server doc and merges it into the local doc.
  */
  private static async createLocalDocFromServerDoc(
    localRepo: Repo,
    serverRepo: Repo,
    docUrl: string
  ): Promise<DocHandle<KonvaNodeSchema> | null> {
    try {
      const websocketAdapter = new BrowserWebSocketClientAdapter(
        NEXT_PUBLIC_WEBSOCKET_URL
      );
      localRepo.networkSubsystem.addNetworkAdapter(websocketAdapter);
      const localDocHandle = localRepo.find(docUrl as AnyDocumentId);
      await localDocHandle.whenReady();
      websocketAdapter.disconnect();
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
    this.localRepo.networkSubsystem.addNetworkAdapter(
      new BrowserWebSocketClientAdapter(this.websocketURL)
    );
  }

  getDocUrl(): string {
    return this.docUrl;
  }

  updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  connectToServer(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  deleteDoc(): void {
    this.serverRepo.delete(this.docUrl as AnyDocumentId);
    this.localRepo.delete(this.docUrl as AnyDocumentId);
  }
}
