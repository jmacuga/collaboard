"use client";
import { Repo } from "@automerge/automerge-repo";

import { ClientDocService } from "@/lib/services/client-doc/client-doc-service";
const connectAutomergeRepo = async (
  docUrl: string | null
): Promise<{ repo: Repo; handleUrl: string }> => {
  const clientDocService = await ClientDocService.create(docUrl);
  const localRepo = clientDocService.localRepo;
  const localDocUrl = clientDocService.localDocUrl;

  return { repo: localRepo, handleUrl: localDocUrl };
};

export { connectAutomergeRepo };
