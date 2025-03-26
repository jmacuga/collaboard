import { WebSocketServer } from "ws";
import { Repo } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";

const reposByDocId = new Map<string, Repo>();
let SERVER_WSS: WebSocketServer | null = null;

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

  return new Repo(config as any);
}

export async function getOrCreateRepo(
  wss: WebSocketServer,
  docId: string,
  hostname: string
): Promise<Repo> {
  if (SERVER_WSS === null) {
    SERVER_WSS = wss;
  }

  if (reposByDocId.has(docId)) {
    return reposByDocId.get(docId)!;
  }
  const repo = await createServerRepo(hostname, docId);
  reposByDocId.set(docId, repo);
  return repo;
}
