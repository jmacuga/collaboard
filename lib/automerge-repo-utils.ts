import { Repo } from "@automerge/automerge-repo";
import { SyncService } from "@/services/sync/syc-service";
import { AutomergeService } from "@/services/automerge/automerge-service";
const connectAutomergeRepo = async (
  docUrl: string | null
): Promise<{ repo: Repo; handleUrl: string }> => {
  const automergeService = new AutomergeService(
    "ws://localhost:3000/api/socket"
  );
  if (!docUrl) {
    throw new Error("Doc URL is required");
  }
  const syncService = await SyncService.create(automergeService, docUrl);
  const { localRepo, localDocUrl } = syncService.initialize();

  return { repo: localRepo, handleUrl: localDocUrl };
};

export { connectAutomergeRepo };
