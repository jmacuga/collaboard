"use server";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { DocHandle } from "@automerge/automerge-repo";
import { isValidAutomergeUrl } from "@automerge/automerge-repo";
import { Repo } from "@automerge/automerge-repo";
import { IAutomergeService } from "./types";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

export class AutomergeService<T extends object>
  implements IAutomergeService<T>
{
  private websocketURL: string;
  private serverRepo: Repo;
  private localRepo: Repo;
  private localDocUrl: string;
  private serverDocUrl: string;

  constructor(websocketURL: string) {
    this.websocketURL = websocketURL;
    this.serverRepo = new Repo({
      network: [new BrowserWebSocketClientAdapter(this.websocketURL)],
    });
    this.localRepo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
    });
    this.localDocUrl = "";
    this.serverDocUrl = "";
  }

  createServerDoc(): string {
    let handle: DocHandle<T> | null = null;
    try {
      console.log("Creating new doc");
      handle = this.serverRepo.create<T>();
      console.log("Created new doc");
    } catch (error) {
      console.error("Error setting up Automerge:", error);
      return "";
    }
    if (!handle) {
      throw new Error("Error creating new doc");
    }
    this.serverDocUrl = handle.url;
    return handle.url;
  }

  connectOrCreateLocalDoc(docUrl?: string | null): string {
    let handle: DocHandle<T> | null = null;
    if (!docUrl || !isValidAutomergeUrl(docUrl)) {
      handle = this.localRepo.create<T>();
    } else {
      handle = this.localRepo.find(docUrl as AnyDocumentId);
    }
    if (!handle) {
      throw new Error("Error finding doc");
    }
    this.localDocUrl = handle.url;
    return handle.url;
  }

  getLocalRepo(): Repo {
    return this.localRepo;
  }

  getServerRepo(): Repo {
    return this.serverRepo;
  }

  deleteServerDoc(docUrl: string): void {
    this.serverRepo.delete(docUrl as AnyDocumentId);
  }

  deleteLocalDoc(docUrl: string): void {
    this.localRepo.delete(docUrl as AnyDocumentId);
  }
}
