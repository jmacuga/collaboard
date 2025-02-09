import KonvaNodeSchema from "@/types/KonvaNodeSchema";
import {
  AnyDocumentId,
  DocHandle,
  isValidAutomergeUrl,
  Repo,
} from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";

const connectAutomergeRepo = (
  docUrl: string | null
): { repo: Repo; handleUrl: string } => {
  let handle: DocHandle<KonvaNodeSchema> | null = null;
  const clientRepo = new Repo({
    network: [
      new BrowserWebSocketClientAdapter("ws://localhost:3000/api/socket"),
    ],
    storage: new IndexedDBStorageAdapter(),
  });

  try {
    if (docUrl && isValidAutomergeUrl(docUrl)) {
      handle = clientRepo.find(docUrl as AnyDocumentId);
      console.log("Connected to existing doc");
    } else {
      handle = clientRepo.create<KonvaNodeSchema>();
      console.log("Created new doc");
    }
  } catch (error) {
    console.error("Error setting up Automerge:", error);
  }
  return { repo: clientRepo, handleUrl: handle?.url || "" };
};

export { connectAutomergeRepo };
