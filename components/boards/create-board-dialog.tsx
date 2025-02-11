"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemaBoard } from "@/schemas/room.schema";
import { createBoardAction } from "@/lib/actions";
import { updateBoard } from "@/lib/data";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AutomergeService } from "@/services/automerge/automerge-service";

type FormData = {
  name: string;
};

export function CreateBoardDialog({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schemaBoard),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const board = await createBoardAction(data, teamId);
      if (board) {
        const websocketUrl = "ws://localhost:3000/api/socket";
        const automergeService = new AutomergeService(websocketUrl);
        const docUrl = automergeService.createServerDoc();
        console.log("Board:", board);
        updateBoard(board._id as string, { docUrl });
        router.refresh();
        console.log("Board created successfully");
        toast.success("Board created successfully");
        setOpen(false);
        form.reset();
      } else {
        toast.error("Failed to create board");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-burnt-sienna hover:bg-burnt-sienna-darker">
          <Plus className="mr-2 h-4 w-4" />
          Create Board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new board to start collaborating with your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter board name" {...field} />
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
                {form.formState.isSubmitting ? "Creating..." : "Create Board"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
