import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";

export default function CloseMergeRequestDialog({
  mergeRequestId,
  boardId,
}: {
  mergeRequestId: string;
  boardId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onSubmit = async () => {
    try {
      const res = await fetch(`/api/merge-requests/${mergeRequestId}/close`, {
        method: "POST",
        body: JSON.stringify({ boardId: boardId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setLoading(true);
      if (res.ok) {
        toast.success("Merge request closed");
      } else {
        toast.error("Failed to close merge request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to close merge request");
    }
    setLoading(false);
    router.push(`/boards/${boardId}/merge-requests`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex gap-1 items-center">
          Close
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Close Merge Request
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to close this merge request?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} variant="destructive" disabled={loading}>
            {loading ? "Closing..." : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
