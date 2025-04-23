import { NetworkAdapterInterface } from "@automerge/automerge-repo";
import { Repo } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";

export class ServerRepoFactory {
  /**
   * Creates a repo and returns both the repo and its network adapter for cleanup
   */
  static create(websocketUrl = NEXT_PUBLIC_WEBSOCKET_URL): {
    repo: Repo;
    adapter: BrowserWebSocketClientAdapter;
    cleanup: () => void;
  } {
    const adapter = new BrowserWebSocketClientAdapter(websocketUrl);
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
