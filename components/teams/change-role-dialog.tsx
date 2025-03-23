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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMemberWithRelations } from "@/lib/services/team/team-service";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

export default function ChangeRoleDialog({
  member,
  teamId,
  currentUserRole,
  adminsCount,
}: {
  member: TeamMemberWithRelations;
  teamId: string;
  currentUserRole: string;
  adminsCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member.role.name);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChangeRole = async () => {
    if (selectedRole === member.role.name) {
      setOpen(false);
      return;
    }

    if (
      member.role.name === "Admin" &&
      selectedRole !== "Admin" &&
      adminsCount <= 1
    ) {
      toast.error("Cannot remove the last admin of the team");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${member.id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: selectedRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change role");
      }

      toast.success("Role changed successfully");
      router.reload();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to change role");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUserRole !== "Admin") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Change Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Change the role for {member.user.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangeRole}
            disabled={isLoading || selectedRole === member.role.name}
          >
            {isLoading ? "Changing..." : "Change Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
