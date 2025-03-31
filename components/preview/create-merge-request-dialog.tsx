import { useEffect, useRef, useState } from "react";
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
import { Change } from "@automerge/automerge";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";

export function CreateMergeRequestDialog({
  boardId,
  localChanges,
  docUrl,
}: {
  boardId: string;
  localChanges: Change[];
  docUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const clientSyncServiceRef = useRef<ClientSyncService | null>(null);

  useEffect(() => {
    if (!clientSyncServiceRef.current) {
      clientSyncServiceRef.current = new ClientSyncService({
        docUrl: docUrl,
      });
    }
  }, [boardId]);

  const onSubmit = async () => {
    try {
      const changes = localChanges.map((change) =>
        Buffer.from(change).toString("base64")
      );
      const response = await fetch("/api/merge-requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boardId, changes }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Merge request created successfully");
        clientSyncServiceRef.current?.revertLocalChanges();
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
        <Button className="flex gap-1 items-center">
          Create Merge Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create Merge Request
          </DialogTitle>
          <DialogDescription>
            Your local changes will be added to merge request and will be
            pending for Admin approval.
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
          <Button onClick={onSubmit}>Create Merge Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
