import { Doc } from "@automerge/automerge";

import { StageSchema } from "@/types/stage-schema";
import { Repo } from "@automerge/automerge-repo";

export interface StorageConfig {
  database?: string;
  store?: string;
}

export interface DocHandleEphemeralMessagePayload<T> {
  message: T;
  // Add other required properties based on the original implementation
}
export interface IDocumentSynchronizer {
  canSync(localDoc: Doc<StageSchema>, docId: string): Promise<boolean>;
  getServerDoc(
    docId: string,
    serverRepo: Repo
  ): Promise<Doc<StageSchema> | null>;
}
