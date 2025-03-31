import { WebSocketServer } from "ws";
import { AnyDocumentId, DocumentId, Repo } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";

let SERVER_WSS: WebSocketServer | null = null;

declare global {
  var __serverRepo: Repo | undefined;
}

export async function createServerRepo(hostname: string, docId: string) {
  const mongoAdapter = new MongoDBStorageAdapter(
    process.env.MONGODB_URI || "",
    {
      dbName: process.env.MONGODB_DB_NAME,
      collectionName: process.env.DOCS_COLLECTION_NAME,
      keyStorageStrategy: "array",
    }
  );

  const config = {
    network: [new NodeWSServerAdapter(SERVER_WSS as any)],
    storage: mongoAdapter,
    peerId: `storage-server-${hostname}`,
    sharePolicy: async (
      _peerId: string,
      requestedDocId: string
    ): Promise<boolean> => {
      return requestedDocId === docId;
    },
  };
  console.log("Creating new repo");
  return new Repo(config as any);
}

export async function getOrCreateRepo(
  docId: string,
  hostname: string,
  wss: WebSocketServer
): Promise<Repo> {
  if (SERVER_WSS === null) {
    SERVER_WSS = wss;
  }
  if (global.__serverRepo) {
    return global.__serverRepo;
  }
  const repo = await createServerRepo(hostname, docId);
  global.__serverRepo = repo;
  return repo;
}
