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
import { useCollaborationClient } from "../board/context/collaboration-client-context";

export function RevertDialog({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const collaborationClient = useCollaborationClient();

  const handleRevertChanges = async () => {
    if (!collaborationClient) return;
    await collaborationClient.removeLocalDoc();
    router.push(`/boards/${boardId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex gap-1 items-center">
          Revert Changes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Revert Changes
          </DialogTitle>
          <DialogDescription>
            Your changes will be reverted to the current version of the board.
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
          <Button variant="destructive" onClick={handleRevertChanges}>
            Revert Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
