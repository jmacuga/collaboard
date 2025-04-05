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
import { ClientSyncContext } from "../board/context/client-sync-context";

export function MergeDialog({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { clientSyncService } = useContext(ClientSyncContext);

  const onSubmit = async () => {
    if (!clientSyncService) return;
    await clientSyncService.connect();
    router.push(`/boards/${boardId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">Merge Changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Merge Changes</DialogTitle>
          <DialogDescription>
            Your changes will be synced with the current version of the board.
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
          <Button onClick={onSubmit}>Merge Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
