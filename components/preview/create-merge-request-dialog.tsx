import { useContext, useEffect, useState } from "react";
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
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { Change } from "@automerge/automerge";
export function CreateMergeRequestDialog({
  boardId,
  localChanges,
}: {
  boardId: string;
  localChanges: Change[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(localChanges);
  }, [localChanges]);
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
            Create a New Merge Request
          </DialogTitle>
          <DialogDescription></DialogDescription>
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
