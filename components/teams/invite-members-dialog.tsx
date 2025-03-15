import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { schemaTeamInvitation } from "@/lib/schemas/team-invitation.schema";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

export function InviteMembersDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schemaTeamInvitation>>({
    resolver: zodResolver(schemaTeamInvitation),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();
  const teamId = router.query.id as string;

  const onSubmit = async (data: z.infer<typeof schemaTeamInvitation>) => {
    if (!teamId) {
      toast.error("Team ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/invitations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, teamId }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "An error occurred");
        return;
      }

      toast.success(result.message || "Invitation sent");
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Invitation error:", error);
      toast.error("An error occurred while sending the invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Invite a user to your team by entering their email address.
        </DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
