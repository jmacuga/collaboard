import { Repo } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";

export async function createServerRepo() {
  const mongoAdapter = new MongoDBStorageAdapter(
    process.env.MONGODB_URI || "",
    {
      dbName: process.env.MONGODB_DB_NAME,
      collectionName: process.env.DOCS_COLLECTION_NAME,
      keyStorageStrategy: "array",
    }
  );

  const config = {
    network: [new NodeWSServerAdapter(global.__serverWSS as any)],
    storage: mongoAdapter,
    peerId: `storage-server-${process.env.HOSTNAME}`,
    sharePolicy: async (
      _peerId: string,
      hostname: string
    ): Promise<boolean> => {
      return hostname === process.env.HOSTNAME;
    },
  };
  return new Repo(config as any);
}

export async function getOrCreateRepo(): Promise<Repo> {
  if (global.__serverRepo) {
    return global.__serverRepo;
  }
  const repo = await createServerRepo();
  global.__serverRepo = repo;
  return repo;
}
