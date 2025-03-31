import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CloseButton({
  mergeRequestId,
  boardId,
}: {
  mergeRequestId: string;
  boardId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClose = async () => {
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
    <Button
      onClick={handleClose}
      className="bg-red-500 text-white hover:bg-red-600"
      disabled={loading}
    >
      {loading ? "Closing..." : "Close"}
    </Button>
  );
}
