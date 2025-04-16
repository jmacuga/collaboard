import {
  Doc,
  Change,
  getHeads,
  getAllChanges,
  clone,
  merge,
  getChanges,
  applyChanges,
} from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { ServerRepoFactory } from "@/lib/utils/server-repo-factory";
import { Repo, AnyDocumentId } from "@automerge/automerge-repo";
import { IDocumentSynchronizer } from "./types";

export class DocumentSynchronizer implements IDocumentSynchronizer {
  private serverRepoFactory: ServerRepoFactory;

  constructor() {
    this.serverRepoFactory = new ServerRepoFactory();
  }

  public async getServerDoc(docId: string): Promise<Doc<LayerSchema> | null> {
    const { repo: serverRepo, cleanup } =
      this.serverRepoFactory.createManagedRepo();
    try {
      const serverHandle = serverRepo.find<LayerSchema>(docId as AnyDocumentId);
      await serverHandle.whenReady();
      return await serverHandle.doc();
    } catch (error) {
      console.error("Error getting server doc:", error);
      return null;
    } finally {
      cleanup();
    }
  }

  public async canSync(
    localDoc: Doc<LayerSchema>,
    docId: string
  ): Promise<boolean> {
    try {
      const { changes } = await this.getLocalMergePreview({
        localDoc,
        docId,
      });

      if ((changes && changes.length > 0) || !changes) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error during document merge:", error);
      return false;
    }
  }

  /**
   * Gets the result of merging local and server documents
   * @returns An object containing the merged document and changes, or null values if merge cannot be performed
   * @throws Error if there are issues accessing local or server documents
   */
  public async getLocalMergePreview({
    localDoc,
    docId,
  }: {
    localDoc: Doc<LayerSchema>;
    docId: string;
  }): Promise<{
    doc: Doc<LayerSchema> | null;
    changes: Change[] | null;
  }> {
    try {
      if (!localDoc) {
        return { doc: null, changes: null };
      }

      const serverDoc = await this.getServerDoc(docId);
      if (!serverDoc) {
        return { doc: null, changes: null };
      }

      const serverDocCopy = clone(serverDoc);
      const mergedDoc = merge(serverDocCopy, localDoc);
      const changes = getChanges(serverDocCopy, mergedDoc);
      return { doc: mergedDoc, changes };
    } catch (error) {
      console.error("Error during document merge:", error);
      return { doc: null, changes: null };
    }
  }

  public async getMergeRequestPreview(
    changes: Change[],
    docId: string
  ): Promise<Doc<LayerSchema> | null> {
    try {
      const serverDoc = await this.getServerDoc(docId);
      if (!serverDoc) {
        return null;
      }
      const serverDocCopy = clone(serverDoc);
      const doc2 = applyChanges(serverDocCopy, changes)[0];
      return doc2;
    } catch (error) {
      console.error("Error during document merge:", error);
      return null;
    }
  }
}
