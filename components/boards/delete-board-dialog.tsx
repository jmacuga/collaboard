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
import { toast } from "react-hot-toast";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
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
  const [checkingUsers, setCheckingUsers] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const docUrl = await fetch(`/api/boards/${boardId}/url`).then((res) =>
        res.json()
      );

      try {
        const syncService = new ClientSyncService(docUrl);
        setCheckingUsers(true);
        const activeUsers = await syncService.getActiveUsers();
        setCheckingUsers(false);

        if (activeUsers.length > 0) {
          toast.error("Board is currently being edited by another user");
          setIsDeleting(false);
          return;
        }

        const response = await fetch(`/api/boards/${boardId}/delete`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          try {
            console.log("Deleting board doc", docUrl);
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
        console.error("Error checking active users:", error);
        toast.error("Failed to check if board is being edited");
        setIsDeleting(false);
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
          {checkingUsers && (
            <p>Checking if board is being edited by another user...</p>
          )}
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
