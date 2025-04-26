export function useLastViewedTeamLog() {
  const updateLastViewed = async ({ teamId }: { teamId?: string }) => {
    try {
      await fetch("/api/last-viewed/team/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ teamId }),
      });
    } catch (error) {
      console.error("Failed to update last viewed timestamp:", error);
    }
  };

  const getLastViewed = async (teamId?: string) => {
    try {
      const response = await fetch(`/api/last-viewed/team/?teamId=${teamId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
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
