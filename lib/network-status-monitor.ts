export type NetworkStatus = "ONLINE" | "OFFLINE" | "UNKNOWN";

interface NetworkMonitorConfig {
  pingEndpoint?: string;
  checkDelay?: number;
}

export class NetworkStatusMonitor {
  private status: NetworkStatus = "UNKNOWN";
  private previousStatus: NetworkStatus = "UNKNOWN";
  private checkTimeout?: NodeJS.Timeout;
  private readonly pingEndpoint: string;
  private readonly checkDelay: number;
  private readonly listeners: Set<
    (status: NetworkStatus, prevStatus: NetworkStatus) => void
  >;
  private readonly boundOnlineHandler: () => void;
  private readonly boundOfflineHandler: () => void;
  private isInitialized: boolean = false;

  constructor(config?: NetworkMonitorConfig) {
    this.pingEndpoint = config?.pingEndpoint ?? "/api/ping";
    this.checkDelay = config?.checkDelay ?? 3000;
    this.listeners = new Set();

    this.boundOnlineHandler = () => {
      this.updateStatus("UNKNOWN");
      this.checkConnection();
    };
    this.boundOfflineHandler = () => this.updateStatus("OFFLINE");

    if (this.isBrowser()) {
      this.initialize();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private initialize(): void {
    if (this.isInitialized) return;

    this.isInitialized = true;
    this.status = navigator.onLine ? "ONLINE" : "OFFLINE";
    this.initializeListeners();
  }

  private initializeListeners(): void {
    window.addEventListener("online", this.boundOnlineHandler);
    window.addEventListener("offline", this.boundOfflineHandler);
  }

  private async checkConnection(): Promise<void> {
    if (this.status !== "UNKNOWN") {
      return;
    }
    try {
      const response = await this.performConnectivityCheck();
      this.handleConnectivityResponse(response);
    } catch (error) {
      this.handleConnectivityError(error);
    }

    this.scheduleNextCheck();
  }

  private async performConnectivityCheck(): Promise<Response> {
    return fetch(this.pingEndpoint, {
      cache: "no-store",
      credentials: "include",
      signal: AbortSignal.timeout(this.checkDelay),
    });
  }

  private handleConnectivityResponse(response: Response): void {
    if (response.ok) {
      this.updateStatus("ONLINE");
    }
  }

  private handleConnectivityError(error: unknown): void {
    console.error("Connection check failed:", error);
    this.updateStatus("UNKNOWN");
  }

  private scheduleNextCheck(): void {
    this.checkTimeout = setTimeout(
      () => this.checkConnection(),
      this.checkDelay
    );
  }

  private updateStatus(newStatus: NetworkStatus): void {
    if (this.status === newStatus) return;

    this.previousStatus = this.status;
    this.status = newStatus;
    this.notifyListeners();
  }

  public subscribe(
    callback: (status: NetworkStatus, prevStatus: NetworkStatus) => void
  ): () => void {
    if (!this.isBrowser()) {
      console.warn(
        "NetworkStatusMonitor: Subscribing in non-browser environment"
      );
      return () => {};
    }

    this.listeners.add(callback);
    return () => this.unsubscribe(callback);
  }

  private unsubscribe(
    callback: (status: NetworkStatus, prevStatus: NetworkStatus) => void
  ): void {
    this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.status, this.previousStatus);
      } catch (error) {
        console.error("Error in network status listener:", error);
      }
    });
  }

  public getCurrentStatus(): {
    networkStatus: NetworkStatus;
    prevNetworkStatus: NetworkStatus;
  } {
    return {
      networkStatus: this.status,
      prevNetworkStatus: this.previousStatus,
    };
  }

  public destroy(): void {
    if (!this.isInitialized) return;

    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
    }

    window.removeEventListener("online", this.boundOnlineHandler);
    window.removeEventListener("offline", this.boundOfflineHandler);
    this.listeners.clear();
    this.isInitialized = false;
  }
}
