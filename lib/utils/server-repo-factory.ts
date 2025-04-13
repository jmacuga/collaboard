import { NetworkAdapterInterface } from "@automerge/automerge-repo";
import { Repo } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";

export class ServerRepoFactory {
  private websocketUrl: string;

  constructor(websocketUrl = NEXT_PUBLIC_WEBSOCKET_URL) {
    this.websocketUrl = websocketUrl;
  }

  createRepo(): Repo {
    return new Repo({
      network: [
        new BrowserWebSocketClientAdapter(
          this.websocketUrl
        ) as any as NetworkAdapterInterface,
      ],
    });
  }

  /**
   * Creates a repo and returns both the repo and its network adapter for cleanup
   */
  createManagedRepo(): {
    repo: Repo;
    adapter: BrowserWebSocketClientAdapter;
    cleanup: () => void;
  } {
    const adapter = new BrowserWebSocketClientAdapter(this.websocketUrl);
    const repo = new Repo({
      network: [adapter as any as NetworkAdapterInterface],
    });

    const cleanup = () => {
      try {
        adapter.disconnect();
        // @ts-ignore
        adapter.emit("close");
        if (
          adapter.socket?.readyState === WebSocket.OPEN ||
          adapter.socket?.readyState === WebSocket.CONNECTING
        ) {
          adapter.socket.close();
        }
      } catch (error) {
        console.error("Error cleaning up server repo:", error);
      }
    };

    return { repo, adapter, cleanup };
  }
}

export default ServerRepoFactory;
