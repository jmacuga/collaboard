import { useState } from "react";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ClientDocService } from "@/lib/services/client-doc/client-doc-service";
interface DeleteBoardDialogProps {
  boardId: string;
  boardName: string;
  teamId: string;
}
export function DeleteBoardDialog({
  boardId,
  boardName,
  teamId,
}: DeleteBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const serverDocUrl = await fetch(`/api/boards/${boardId}/url`).then(
        (res) => res.json()
      );
      const response = await fetch(`/api/boards/${boardId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        try {
          console.log("Deleting board doc", serverDocUrl);
          const syncService = await ClientDocService.create(
            serverDocUrl.docUrl
          );
          syncService.deleteDoc();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete board doc");
        }
        console.log("Board deleted successfully");
        toast.success("Board deleted successfully");
        router.push(`/teams/${teamId}/boards/`);
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
