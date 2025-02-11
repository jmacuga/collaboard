"use client";
import { ISyncService } from "./types";
import KonvaNodeSchema from "@/types/KonvaNodeSchema";
import { AutomergeService } from "../automerge/automerge-service";
import { Repo } from "@automerge/automerge-repo";
import { db } from "@/lib/indexed-db";

export class SyncService implements ISyncService {
  private localDocUrl: string;
  private serverDocUrl: string;
  private automergeService: AutomergeService<KonvaNodeSchema>;

  private constructor(
    automergeService: AutomergeService<KonvaNodeSchema>,
    serverDocUrl: string,
    localDocUrl: string
  ) {
    this.automergeService = automergeService;
    this.serverDocUrl = serverDocUrl;
    this.localDocUrl = localDocUrl;
  }

  static async create(
    automergeService: AutomergeService<KonvaNodeSchema>,
    serverDocUrl: string
  ): Promise<SyncService> {
    const mapping = await db.urlMappings.get(serverDocUrl);
    let localDocUrl = mapping?.localUrl;

    if (!localDocUrl) {
      localDocUrl = automergeService.connectOrCreateLocalDoc();
      await db.urlMappings.put({
        serverUrl: serverDocUrl,
        localUrl: localDocUrl,
      });
    }

    return new SyncService(automergeService, serverDocUrl, localDocUrl);
  }

  /**
   * Creates a empty board data in the database
   * @returns document url of the board data
   * @throws Error if board data is not created
   */
  createBoardData(): string {
    const serverDoc = this.automergeService.createServerDoc();
    return serverDoc;
  }

  /**
   * Initializes the syncronization service with an document URL.
   * Connects to the local repo or creates a new one if it doesn't exist.
   * @param docUrl - Optional URL of the document to connect to
   * @returns Promise that resolves when initialization is complete
   * @throws Error if initialization fails
   */
  initialize(): { localRepo: Repo; localDocUrl: string } {
    return {
      localRepo: this.automergeService.getLocalRepo(),
      localDocUrl: this.localDocUrl,
    };
  }

  getLocalDocUrl(): string {
    return this.localDocUrl;
  }

  getServerDocUrl(): string {
    return this.serverDocUrl;
  }

  updateServerData(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  connectToServer(docUrl: string): void {
    throw new Error("Method not implemented.");
  }

  deleteDoc(): void {
    this.automergeService.deleteServerDoc(this.serverDocUrl);
    this.automergeService.deleteLocalDoc(this.localDocUrl);
  }
}
