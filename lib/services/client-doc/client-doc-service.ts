"use client";
import { IClientDocService } from "./types";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import {
  isValidAutomergeUrl,
  Repo,
  AnyDocumentId,
} from "@automerge/automerge-repo";
import { db } from "@/lib/indexed-db";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";

export class ClientDocService implements IClientDocService {
  localDocUrl: string;
  serverDocUrl: string;
  serverRepo: Repo;
  localRepo: Repo;

  private constructor({
    serverDocUrl,
    localDocUrl,
    serverRepo,
    localRepo,
  }: {
    serverDocUrl: string;
    localDocUrl: string;
    serverRepo: Repo;
    localRepo: Repo;
  }) {
    this.serverDocUrl = serverDocUrl;
    this.localDocUrl = localDocUrl;
    this.serverRepo = serverRepo;
    this.localRepo = localRepo;
  }

  static async create(serverDocUrl: string): Promise<ClientDocService> {
    const websocketURL = NEXT_PUBLIC_WEBSOCKET_URL;
    const serverRepo = new Repo({
      network: [new BrowserWebSocketClientAdapter(websocketURL)],
    });
    const localRepo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
    });

    const mapping = await db.urlMappings.get(serverDocUrl);
    let localDocUrl = mapping?.localUrl;

    if (!localDocUrl) {
      console.log("Local doc URL not found in indexedDB - creating local doc");
      localDocUrl = await ClientDocService.createLocalDocFromServerDoc(
        localRepo,
        serverRepo,
        serverDocUrl
      );
    } else {
      console.log("Local doc URL received from indexedDB");
    }
    if (!localDocUrl) {
      throw new Error("Local doc could not be initialized");
    }
    await db.urlMappings.put({
      serverUrl: serverDocUrl,
      localUrl: localDocUrl,
    });
    return new ClientDocService({
      serverDocUrl: serverDocUrl,
      localDocUrl: localDocUrl,
      serverRepo: serverRepo,
      localRepo: localRepo,
    });
  }
  /*
  This function creates a local doc from a server doc.
  It clones the server doc and merges it into the local doc.
  */
  private static async createLocalDocFromServerDoc(
    localRepo: Repo,
    serverRepo: Repo,
    serverDocUrl: string
  ) {
    try {
      // clone server doc to local doc
      if (!isValidAutomergeUrl(serverDocUrl)) {
        throw new Error("Invalid server doc URL");
      }
      const serverDocHandle = await serverRepo.find(
        serverDocUrl as AnyDocumentId
      );
      await serverDocHandle.whenReady();
      const clonedDocHandle = serverRepo.clone(serverDocHandle);
      await clonedDocHandle.whenReady();
      const localDocHandle = localRepo.create<KonvaNodeSchema>();
      localDocHandle.merge(clonedDocHandle);
      return localDocHandle.url;
    } catch (error) {
      console.error("Error creating local doc from server doc", error);
      return;
    }
  }

  updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  connectToServer(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  deleteDoc(): void {
    this.serverRepo.delete(this.serverDocUrl as AnyDocumentId);
    this.localRepo.delete(this.localDocUrl as AnyDocumentId);
  }
}
