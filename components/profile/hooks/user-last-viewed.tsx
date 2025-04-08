import { UserLastViewedLogType } from "@prisma/client";

export function useUpdateLastViewed() {
  const updateLastViewed = async ({
    type,
    teamId,
    boardId,
  }: {
    type: UserLastViewedLogType;
    teamId?: string;
    boardId?: string;
  }) => {
    try {
      await fetch("/api/last-viewed/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ type, teamId, boardId }),
      });
    } catch (error) {
      console.error("Failed to update last viewed timestamp:", error);
    }
  };

  const getLastViewed = async (
    type: UserLastViewedLogType,
    boardId?: string,
    teamId?: string
  ) => {
    try {
      const response = await fetch(
        `/api/last-viewed/?type=${type}&boardId=${boardId}&teamId=${teamId}`,
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
