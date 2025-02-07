import { WebSocketServer } from "ws";
import { Repo } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";

export function createAutomergeServer(wss: WebSocketServer, hostname: string) {
  const mongoAdapter = new MongoDBStorageAdapter(process.env.MONGO_URL || "", {
    dbName: "collaboard",
    collectionName: "docs",
    keyStorageStrategy: "array",
  });

  const config = {
    network: [new NodeWSServerAdapter(wss as any)],
    storage: mongoAdapter,
    peerId: `storage-server-${hostname}`,
  };

  return new Repo(config);
}
