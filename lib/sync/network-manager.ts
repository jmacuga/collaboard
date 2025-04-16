import { NetworkAdapterInterface, Repo } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { INetworkManager } from "./types";

export class NetworkManager implements INetworkManager {
  private networkAdapter: BrowserWebSocketClientAdapter;
  private readonly DISABLE_RETRY_INTERVAL = 10_000_000;
  private websocketURL: string;
  constructor(websocketURL: string) {
    this.websocketURL = websocketURL;
    this.networkAdapter = this.createNetworkAdapter();
  }

  private createNetworkAdapter(): BrowserWebSocketClientAdapter {
    return new BrowserWebSocketClientAdapter(
      this.websocketURL,
      this.DISABLE_RETRY_INTERVAL
    );
  }

  public async connect(repo: Repo): Promise<void> {
    if (this.isConnected()) return;
    try {
      this.networkAdapter = this.createNetworkAdapter();
      repo.networkSubsystem.addNetworkAdapter(
        this.networkAdapter as unknown as NetworkAdapterInterface
      );
      await repo.networkSubsystem.whenReady();
    } catch (error) {
      throw new Error(`Connection failed: ${error}`);
    }
  }

  public disconnect(): void {
    if (!this.isConnected()) return;

    try {
      this.networkAdapter.disconnect();
      if (this.isSocketActive()) {
        this.networkAdapter.socket?.close();
      }
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  }

  public isConnected(): boolean {
    return this.isSocketActive();
  }

  private isSocketActive(): boolean {
    return (
      this.networkAdapter.socket?.readyState === WebSocket.OPEN ||
      this.networkAdapter.socket?.readyState === WebSocket.CONNECTING
    );
  }
}
