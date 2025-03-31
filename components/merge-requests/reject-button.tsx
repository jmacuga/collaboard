import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RejectButton({
  mergeRequestId,
  boardId,
}: {
  mergeRequestId: string;
  boardId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleReject = async () => {
    try {
      const res = await fetch(`/api/merge-requests/${mergeRequestId}/reject`, {
        method: "POST",
        body: JSON.stringify({ boardId: boardId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setLoading(true);
      if (res.ok) {
        toast.success("Merge request rejected");
      } else {
        toast.error("Failed to reject merge request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject merge request");
    }
    setLoading(false);
    router.push(`/boards/${boardId}/merge-requests`);
  };

  return (
    <Button
      onClick={handleReject}
      className="bg-red-500 text-white hover:bg-red-600"
      disabled={loading}
    >
      {loading ? "Rejecting..." : "Reject"}
    </Button>
  );
}
