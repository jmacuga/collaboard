import {
  DocHandle,
  DocHandleEphemeralMessagePayload,
} from "@automerge/automerge-repo";
import { UserStatusPayload } from "@/types/userStatusPayload";
import { LayerSchema } from "@/types/KonvaNodeSchema";

export class UserPresenceMonitor {
  private readonly PRESENCE_TIMEOUT = 2500;

  public constructor() {}

  public async getActiveUsers(
    handle: DocHandle<LayerSchema>
  ): Promise<string[]> {
    const activeUsers: Set<string> = new Set();

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.cleanup(handle, resolve, activeUsers);
      }, this.PRESENCE_TIMEOUT);

      handle.on("ephemeral-message", (event) => {
        this.handlePresenceMessage(event, activeUsers);
      });
    });
  }

  private handlePresenceMessage(
    event: DocHandleEphemeralMessagePayload<UserStatusPayload>,
    activeUsers: Set<string>
  ): void {
    try {
      const [userId] = event.message as [string, unknown];
      if (userId) {
        activeUsers.add(userId);
      }
    } catch (error) {
      console.error("Presence message processing error:", error);
    }
  }

  private cleanup(
    handle: DocHandle<LayerSchema>,
    resolve: (users: string[]) => void,
    activeUsers: Set<string>
  ): void {
    handle.removeListener("ephemeral-message");
    resolve(Array.from(activeUsers));
  }
}
