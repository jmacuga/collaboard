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
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { CollaborationClient } from "@/lib/sync/collaboration-client";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { PeerId } from "@automerge/automerge-repo";
import { ActiveUsersError } from "@/lib/sync/collaboration-client";
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
  const session = useSession();
  const userId = session.data?.user?.id;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/boards/${boardId}/docId`).then((res) =>
        res.json()
      );
      const docId = response.docId;

      try {
        const collaborationClient = new CollaborationClient(
          docId,
          NEXT_PUBLIC_WEBSOCKET_URL,
          userId as PeerId
        );
        setCheckingUsers(true);
        const activeUsers = await collaborationClient.getActiveUsers();
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
            collaborationClient.deleteDoc();
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete board doc");
          }
          toast.success("Board deleted successfully");
          router.push(`/teams/${teamId}/boards/`);
          setOpen(false);
        } else {
          toast.error("Failed to delete board");
        }
      } catch (error) {
        if (error instanceof ActiveUsersError) {
          toast.error("Failed to check if board is being edited");
        } else {
          console.error("Error checking active users:", error);
          toast.error("Failed to check if board is being edited");
        }
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
          className="text-muted-foreground hover:text-destructive"
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
        <DialogFooter className="flex flex-col items-center sm:flex-row sm:justify-between sm:space-x-2">
          {checkingUsers && (
            <div className="flex items-center justify-center w-full py-2 mb-3 sm:mb-0 sm:justify-start">
              <Loader2
                className="h-4 w-4 mr-2 animate-spin text-primary"
                aria-hidden="true"
              />
              <span className="text-sm text-muted-foreground">
                Checking active users...
              </span>
            </div>
          )}
          <div
            className={`flex justify-end space-x-2 ${
              checkingUsers ? "w-full sm:w-auto" : "w-full"
            }`}
          >
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting || checkingUsers}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || checkingUsers}
              className="flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="h-4 w-4 mr-2 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete Board"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
