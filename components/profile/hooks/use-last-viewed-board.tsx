export function useLastViewedBoardLog() {
  const updateLastViewed = async ({ boardId }: { boardId?: string }) => {
    try {
      await fetch("/api/last-viewed/board/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ boardId }),
      });
    } catch (error) {
      console.error("Failed to update last viewed timestamp:", error);
    }
  };

  const getLastViewed = async (boardId?: string) => {
    try {
      const response = await fetch(
        `/api/last-viewed/board/?boardId=${boardId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get last viewed timestamp");
      }
      const data = await response.json();
      return data.lastViewed;
    } catch (error) {
      console.error("Failed to get last viewed timestamp:", error);
      return null;
    }
  };
  return { updateLastViewed, getLastViewed };
}
