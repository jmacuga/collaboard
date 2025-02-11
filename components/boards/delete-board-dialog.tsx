"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteBoardAction } from "@/lib/actions";
import { SyncService } from "@/services/sync/syc-service";
import { AutomergeService } from "@/services/automerge/automerge-service";
import { getBoardDocUrl } from "@/lib/data";

interface DeleteBoardDialogProps {
  boardId: string;
  boardName: string;
}

export function DeleteBoardDialog({
  boardId,
  boardName,
}: DeleteBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const automergeService = new AutomergeService(
    "ws://localhost:3000/api/socket"
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const boardDocUrl = await getBoardDocUrl(boardId);
      if (!boardDocUrl) {
        console.error("Board doc url not found");
      } else {
        const syncService = await SyncService.create(
          automergeService,
          boardDocUrl
        );
        syncService.deleteDoc();
      }
      const success = await deleteBoardAction(boardId);

      if (success) {
        toast.success("Board deleted successfully");
        router.refresh();
        setOpen(false);
      } else {
        toast.error("Failed to delete board");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          key="delete-board-btn"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Board</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{boardName}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
