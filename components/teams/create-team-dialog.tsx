import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { DialogTrigger } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";
import { schemaTeam } from "@/lib/schemas/team.schema";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

type TeamFormData = {
  name: string;
};

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<TeamFormData>({
    resolver: zodResolver(schemaTeam),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      const response = await fetch("/api/teams/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        router.push("/teams");
        setOpen(false);
        form.reset();
        toast.success("Team created successfully");
      } else {
        throw new Error("Failed to create team");
      }
    } catch (error) {
      toast.error("Failed to create team");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>
        <DialogDescription>Create a new team.</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-burnt-sienna hover:bg-burnt-sienna-darker"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
