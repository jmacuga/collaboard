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
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";
import { TeamMemberWithRelations } from "@/lib/services/team/team-service";

export default function DeleteMemberDialog({
  member,
  teamId,
}: {
  member: TeamMemberWithRelations;
  teamId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDeleteMember = async (memberId: string) => {
    try {
      setIsDeleting(memberId);
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberId}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to delete member");
        throw new Error(data.message || "Failed to delete member");
      }

      toast.success("Member deleted successfully");
      router.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete member"
      );
    } finally {
      setIsDeleting(null);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting === member.id || member.role.name === "Owner"}
        >
          {isDeleting === member.id ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete team member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {member.user.name} from the team?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteMember(member.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
