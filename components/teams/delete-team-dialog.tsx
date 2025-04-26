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
interface DeleteTeamDialogProps {
  teamId: string;
  teamName: string;
}

export function DeleteTeamDialog({ teamId, teamName }: DeleteTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [checkingUsers, setCheckingUsers] = useState(false);
  const [deletingBoards, setDeletingBoards] = useState(false);
  const [boardName, setBoardName] = useState<string>();
  const [boardsFailedToDelete, setBoardsFailedToDelete] = useState<string[]>(
    []
  );
  const session = useSession();
  const userId = session.data?.user?.id;

  const fetchBoards = async () => {
    try {
      const boards = await fetch(`/api/teams/${teamId}/boards`).then((res) =>
        res.json()
      );
      return boards.boards;
    } catch (error) {
      console.error("Error", error);
      toast.error("Failed to fetch boards");
      return null;
    }
  };

  const deleteBoard = async (
    boardId: string,
    boardName: string,
    client: CollaborationClient
  ) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        client.deleteDoc();
        toast.success("Board deleted successfully");
        return true;
      } else {
        toast.error(`Failed to delete board ${boardName}`);
        return false;
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Failed to delete board");
      return false;
    }
  };

  const checkActiveUsers = async (client: CollaborationClient) => {
    setCheckingUsers(true);
    const activeUsers = await client.getActiveUsers();
    setCheckingUsers(false);
    return activeUsers.length > 0;
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/teams");
        toast.success("Team deleted successfully");
        setIsDeleting(false);
      } else {
        toast.error("Failed to delete team");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Failed to delete team");
      setIsDeleting(false);
    }
  };

  const handleDelete = async () => {
    try {
      let boardsFailedToDelete: string[] = [];
      setDeletingBoards(true);
      setIsDeleting(true);
      const boards = await fetchBoards();
      if (boards === null) {
        toast.error("Failed to fetch boards");
        setIsDeleting(false);
        return;
      }

      setDeletingBoards(true);
      for (const board of boards) {
        const client = new CollaborationClient(
          board.automergeDocId,
          NEXT_PUBLIC_WEBSOCKET_URL,
          userId as PeerId
        );
        client.connect();
        setBoardName(board.name);
        const activeUsers = await checkActiveUsers(client);
        if (activeUsers) {
          toast.error(
            `Board ${board.name} is currently being edited by another user - skipping `
          );
          boardsFailedToDelete.push(board.name);
        } else {
          const deleted = await deleteBoard(board.id, board.name, client);
          if (!deleted) boardsFailedToDelete.push(board.name);
        }
        client.disconnect();
      }
      setDeletingBoards(false);

      if (boardsFailedToDelete.length === 0) {
        await deleteTeam(teamId);
      } else {
        setBoardsFailedToDelete(boardsFailedToDelete);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Sorry, something went wrong. Please try again later.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {boardsFailedToDelete.length === 0 && (
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
              <DialogTitle>Delete Team</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete team &quot;{teamName}&quot;?
                This action cannot be undone. This will delete all boards
                associated with this team.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col items-center sm:flex-row sm:justify-between sm:space-x-2">
              {deletingBoards && (
                <div className="flex items-center justify-center w-full py-2 mb-3 sm:mb-0 sm:justify-start">
                  <Loader2
                    className="h-4 w-4 mr-2 animate-spin text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">
                    Deleting board {boardName}...
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
                    "Delete Team"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {boardsFailedToDelete.length > 0 && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Failed to delete all team boards</DialogTitle>
              The following boards are currently being edited by another user
              and cannot be deleted:
              <ul className="list-disc list-inside">
                {boardsFailedToDelete.map((board) => (
                  <li key={board}>{board}</li>
                ))}
              </ul>
              Please try again later or delete the boards manually.
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
