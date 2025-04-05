import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { TeamInvitation } from "@prisma/client";

export function InvitationsList({
  invitations,
}: {
  invitations: (TeamInvitation & {
    team: { name: string };
    host: { name: string; email: string };
  })[];
}) {
  const router = useRouter();
  const [processingInvitations, setProcessingInvitations] = useState<
    Record<string, boolean>
  >({});

  const handleInvitationAction = async (
    invitationId: string,
    action: "accept" | "reject"
  ) => {
    setProcessingInvitations((prev) => ({ ...prev, [invitationId]: true }));

    try {
      const url = `/api/invitations/${invitationId}/${action}`;
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} invitation`);
      }

      toast.success(
        `Invitation ${
          action === "accept" ? "accepted" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error);
      toast.error(`Failed to ${action} invitation`);
    } finally {
      router.push("/profile/invitations");
      setProcessingInvitations((prev) => ({ ...prev, [invitationId]: false }));
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No pending invitations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Invitations</h2>
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{invitation.team.name}</CardTitle>
            <CardDescription>
              Invited by {invitation.host.name || invitation.host.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              Received on {new Date(invitation.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInvitationAction(invitation.id, "reject")}
              disabled={processingInvitations[invitation.id]}
            >
              {processingInvitations[invitation.id] ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => handleInvitationAction(invitation.id, "accept")}
              disabled={processingInvitations[invitation.id]}
            >
              {processingInvitations[invitation.id] ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Accept
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
