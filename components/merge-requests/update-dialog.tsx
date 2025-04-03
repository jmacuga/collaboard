import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { getChanges } from "@automerge/automerge";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { ClientSyncContext } from "../board/context/client-sync-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";

export function UpdateMergeRequestDialog({
  boardId,
  mergeRequestId,
  serverDocId,
}: {
  boardId: string;
  mergeRequestId: string;
  serverDocId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { clientSyncService } = useContext(ClientSyncContext);
  const [doc, changeDoc] = useDocument<LayerSchema>(
    clientSyncService?.getDocUrl() as AnyDocumentId
  );

  const calculateChanges = async () => {
    if (!clientSyncService) return [];
    const serverDoc = await clientSyncService
      ?.createServerRepo()
      .find<LayerSchema>(serverDocId as AnyDocumentId)
      .doc();
    return getChanges(serverDoc, doc);
  };

  const onSubmit = async () => {
    try {
      const changes = await calculateChanges();
      const changesBase64 = changes.map((change) =>
        Buffer.from(change).toString("base64")
      );
      const response = await fetch(
        `/api/merge-requests/${mergeRequestId}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ changes: changesBase64, boardId }),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Merge request updated successfully");
        clientSyncService?.deleteDoc();
        setOpen(false);
        router.push(`/boards/${boardId}/merge-requests`);
        return;
      }

      if (!response.ok && result.errors) {
        throw new Error(result.message || "Failed to create merge request");
      } else {
        throw new Error(result.message || "Failed to create merge request");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      console.error(error);
    } finally {
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">Submit Changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Submit Changes
          </DialogTitle>
          <DialogDescription>
            Your local changes will be added to the merge request.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
