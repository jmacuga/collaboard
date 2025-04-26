import {
  Doc,
  Change,
  clone,
  merge,
  getChanges,
  applyChanges,
} from "@automerge/automerge";
import { StageSchema } from "@/types/stage-schema";
import { ServerRepoFactory } from "@/lib/utils/server-repo-factory";
import { AnyDocumentId } from "@automerge/automerge-repo";

async function getServerDoc<T>(docId: string): Promise<Doc<T> | null> {
  const { repo: serverRepo, cleanup } = ServerRepoFactory.create();
  try {
    const serverHandle = serverRepo.find<T>(docId as AnyDocumentId);
    return clone(await serverHandle.doc());
  } catch (error) {
    console.error("Error getting server doc:", error);
    return null;
  } finally {
    cleanup();
  }
}

/**
 * Gets the result of merging local and server documents
 * @returns An object containing the merged document and changes, or null values if merge cannot be performed
 * @throws Error if there are issues accessing local or server documents
 */
async function getLocalMergePreview<T>({
  localDoc,
  docId,
}: {
  localDoc: Doc<T>;
  docId: string;
}): Promise<{
  doc: Doc<T> | null;
  changes: Change[] | null;
}> {
  try {
    if (!localDoc || !docId) {
      return { doc: null, changes: null };
    }

    const serverDoc = await getServerDoc<T>(docId);
    if (serverDoc === null) {
      return { doc: null, changes: null };
    }
    const mergedDoc = merge<T>(serverDoc, localDoc);
    const changes = getChanges<T>(serverDoc, mergedDoc);
    return { doc: mergedDoc, changes };
  } catch (error) {
    console.error("Error during document merge:", error);
    return { doc: null, changes: null };
  }
}

async function getMergeRequestPreview(
  changes: Change[],
  docId: string
): Promise<Doc<StageSchema> | null> {
  try {
    const serverDoc = await getServerDoc(docId);
    if (!serverDoc) {
      return null;
    }
    const doc2 = applyChanges(serverDoc, changes)[0];
    return doc2;
  } catch (error) {
    console.error("Error during document merge:", error);
    return null;
  }
}

export { getServerDoc, getLocalMergePreview, getMergeRequestPreview };
