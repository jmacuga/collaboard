import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AcceptButton({
  mergeRequestId,
  boardId,
}: {
  mergeRequestId: string;
  boardId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/merge-requests/${mergeRequestId}/accept`, {
        method: "POST",
        body: JSON.stringify({ boardId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setLoading(true);
      if (res.ok) {
        toast.success("Merge request accepted");
      } else {
        toast.error("Failed to accept merge request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept merge request");
    }
    setLoading(false);
    router.push(`/boards/${boardId}/merge-requests`);
  };

  return (
    <Button
      onClick={handleAccept}
      className="bg-green-500 text-white hover:bg-green-600"
      aria-label="Accept merge request"
      disabled={loading}
    >
      {loading ? "Accepting..." : "Accept"}
    </Button>
  );
}
