import { WebSocketServer } from "ws";
import { Repo } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";

export async function createAutomergeServer(
  wss: WebSocketServer | null,
  hostname: string
) {
  const mongoAdapter = new MongoDBStorageAdapter(
    process.env.MONGODB_URI || "",
    {
      dbName: "collaboard",
      collectionName: "docs",
      keyStorageStrategy: "array",
    }
  );

  if (wss === null) {
    const config = {
      network: [],
      storage: mongoAdapter,
    };
    return new Repo(config);
  }

  const config = {
    network: [new NodeWSServerAdapter(wss as any)],
    storage: mongoAdapter,
    peerId: `storage-server-${hostname}`,
  };

  const repo = new Repo(config as any);
  return repo;
}
