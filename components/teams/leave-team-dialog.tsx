import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";
import { deleteArchivedBoards } from "@/lib/utils/indexeddb-garbage-collector";

interface LeaveTeamDialogProps {
  teamId: string;
  teamName: string;
}

export function LeaveTeamDialog({ teamId, teamName }: LeaveTeamDialogProps) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLeaveTeam = async () => {
    try {
      setIsLeaving(true);
      const response = await fetch(`/api/teams/${teamId}/leave`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to leave team");
      }

      toast.success("Successfully left the team");
      router.push("/teams");
      await deleteArchivedBoards();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to leave team"
      );
    } finally {
      setIsLeaving(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLeaving}>
          {isLeaving ? "Leaving..." : "Leave Team"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave {teamName}? You will lose access to
            all boards and resources associated with this team.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeaveTeam}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Leave Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
