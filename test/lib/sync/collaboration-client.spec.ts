import {
  CollaborationClient,
  MergeError,
  ConnectionError,
  ActiveUsersError,
} from "@/lib/sync/collaboration-client";
import { UserPresenceMonitor } from "@/lib/sync/user-presence-monitor";
import { StageSchema } from "@/types/stage-schema";

// Setup mocks
jest.mock("@automerge/automerge-repo-storage-indexeddb");
jest.mock("@automerge/automerge-repo-network-websocket");
jest.mock("@/lib/sync/user-presence-monitor");
jest.mock("@/lib/sync/synchronizer");
jest.mock("@automerge/automerge-repo");
jest.mock("@automerge/automerge");

// Create mock types
type MockDocHandle = {
  whenReady: jest.Mock;
  doc: jest.Mock;
  state: string;
  on: jest.Mock;
  removeListener: jest.Mock;
};

type MockRepo = {
  find: jest.Mock;
  networkSubsystem: {
    addNetworkAdapter: jest.Mock;
    whenReady: jest.Mock;
  };
  storageSubsystem: {
    removeDoc: jest.Mock;
  };
  delete: jest.Mock;
};

type MockWebSocketAdapter = {
  disconnect: jest.Mock;
  socket: {
    readyState: number;
    close: jest.Mock;
  };
};

// Import the synchronizer mock functions
const syncModule = jest.requireMock("@/lib/sync/synchronizer");
const { getLocalMergePreview, getMergeRequestPreview } = syncModule;

describe("CollaborationClient", () => {
  let client: CollaborationClient;
  const mockDocId = "test-doc-id";
  const mockWebsocketUrl = "ws://test.websocket.url";
  const mockPeerId = { __peerId: true };

  // Create mocks
  let mockHandle: MockDocHandle;
  let mockRepo: MockRepo;
  let mockWebsocketAdapter: MockWebSocketAdapter;

  // Repo constructor mock
  const MockRepo = jest.requireMock("@automerge/automerge-repo").Repo;
  const MockWebSocketAdapter = jest.requireMock(
    "@automerge/automerge-repo-network-websocket"
  ).BrowserWebSocketClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up mock handle
    mockHandle = {
      whenReady: jest.fn().mockResolvedValue(undefined),
      doc: jest.fn().mockResolvedValue({}),
      state: "ready",
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    // Set up mock repo
    mockRepo = {
      find: jest.fn().mockResolvedValue(mockHandle),
      networkSubsystem: {
        addNetworkAdapter: jest.fn(),
        whenReady: jest.fn().mockResolvedValue(undefined),
      },
      storageSubsystem: {
        removeDoc: jest.fn(),
      },
      delete: jest.fn(),
    };

    // Set up mock websocket adapter
    mockWebsocketAdapter = {
      disconnect: jest.fn(),
      socket: {
        readyState: WebSocket.OPEN,
        close: jest.fn(),
      },
    };

    // Return mock repo when constructing Repo
    MockRepo.mockReturnValue(mockRepo);

    // Return mock adapter when constructing WebSocketAdapter
    MockWebSocketAdapter.mockReturnValue(mockWebsocketAdapter);

    // Create client instance
    client = new CollaborationClient(
      mockDocId,
      mockWebsocketUrl,
      mockPeerId as any
    );
  });

  describe("constructor", () => {
    it("should correctly initialize the client", () => {
      expect(client.getDocId()).toBe(mockDocId);
      expect(client.getDocUrl()).toBe(`automerge:${mockDocId}`);
      expect(MockRepo).toHaveBeenCalled();
    });
  });

  describe("initialize", () => {
    it("should initialize the client and return the document handle when document is ready", async () => {
      mockHandle.state = "ready";

      const result = await client.initialize();

      expect(mockRepo.find).toHaveBeenCalledWith(mockDocId);
      expect(mockHandle.whenReady).toHaveBeenCalledWith([
        "unavailable",
        "requesting",
        "ready",
      ]);
      expect(result).toBe(mockHandle);
    });

    it("should connect to the server when the document is not ready", async () => {
      // First call returns with state not ready
      let readyCallCount = 0;
      mockHandle.whenReady.mockImplementation(() => {
        if (readyCallCount === 0) {
          mockHandle.state = "requesting";
          readyCallCount++;
          return Promise.resolve();
        } else {
          mockHandle.state = "ready";
          return Promise.resolve();
        }
      });

      const connectSpy = jest.spyOn(client, "connect").mockResolvedValue();

      const result = await client.initialize();

      expect(connectSpy).toHaveBeenCalled();
      expect(mockHandle.whenReady).toHaveBeenCalledTimes(2);
      expect(result).toBe(mockHandle);
    });

    it("should throw error if initialization fails", async () => {
      mockHandle.whenReady.mockRejectedValue(new Error("Init error"));

      await expect(client.initialize()).rejects.toThrow(
        "Initialization failed: Error: Init error"
      );
    });
  });

  describe("getHandle", () => {
    it("should return the document handle", async () => {
      const result = await client.getHandle();

      expect(mockRepo.find).toHaveBeenCalledWith(mockDocId);
      expect(result).toBe(mockHandle);
    });
  });

  describe("getRepo", () => {
    it("should return the repository", () => {
      const result = client.getRepo();

      expect(result).toBe(mockRepo);
    });
  });

  describe("canConnect", () => {
    it("should return true if socket is active", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(true);

      const result = await client.canConnect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if there are pending changes", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(false);

      const mockDoc = {};
      mockHandle.doc.mockResolvedValue(mockDoc);

      getLocalMergePreview.mockResolvedValue({
        doc: {},
        changes: [{}],
      });

      const result = await client.canConnect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(getLocalMergePreview).toHaveBeenCalledWith({
        localDoc: mockDoc,
        docId: mockDocId,
      });
      expect(result).toBe(false);
    });

    it("should return true if there are no pending changes", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(false);

      const mockDoc = {};
      mockHandle.doc.mockResolvedValue(mockDoc);

      getLocalMergePreview.mockResolvedValue({
        doc: {},
        changes: [],
      });

      const result = await client.canConnect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(getLocalMergePreview).toHaveBeenCalledWith({
        localDoc: mockDoc,
        docId: mockDocId,
      });
      expect(result).toBe(true);
    });

    it("should throw MergeError if changes are null", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(false);

      const mockDoc = {};
      mockHandle.doc.mockResolvedValue(mockDoc);

      getLocalMergePreview.mockResolvedValue({
        doc: null,
        changes: null,
      });

      await expect(client.canConnect()).rejects.toThrow(MergeError);
      await expect(client.canConnect()).rejects.toThrow(
        "Error getting merge preview"
      );
    });
  });

  describe("connect", () => {
    it("should not connect if socket is already active", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(true);

      await client.connect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(MockWebSocketAdapter).not.toHaveBeenCalled();
      expect(
        mockRepo.networkSubsystem.addNetworkAdapter
      ).not.toHaveBeenCalled();
    });

    it("should connect if socket is not active", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(false);

      await client.connect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(MockWebSocketAdapter).toHaveBeenCalledWith(
        mockWebsocketUrl,
        expect.any(Number)
      );
      expect(mockRepo.networkSubsystem.addNetworkAdapter).toHaveBeenCalled();
      expect(mockRepo.networkSubsystem.whenReady).toHaveBeenCalled();
    });

    it("should throw ConnectionError if connection fails", async () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(false);
      mockRepo.networkSubsystem.whenReady.mockRejectedValue(
        new Error("Connection error")
      );

      await expect(client.connect()).rejects.toThrow(ConnectionError);
      await expect(client.connect()).rejects.toThrow("Connection failed");

      expect(isSocketActiveSpy).toHaveBeenCalled();
    });
  });

  describe("disconnect", () => {
    it("should not disconnect if websocket adapter is null", () => {
      // Set websocketAdapter to null
      Object.defineProperty(client, "websocketAdapter", {
        value: null,
        writable: true,
      });

      client.disconnect();

      expect(mockWebsocketAdapter.disconnect).not.toHaveBeenCalled();
      expect(mockWebsocketAdapter.socket.close).not.toHaveBeenCalled();
    });

    it("should disconnect if socket is active", () => {
      (client as any).websocketAdapter = mockWebsocketAdapter;
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(true);

      client.disconnect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(mockWebsocketAdapter.disconnect).toHaveBeenCalled();
      expect(mockWebsocketAdapter.socket.close).toHaveBeenCalled();
    });

    it("should handle disconnection errors", () => {
      //add websocket adapter
      (client as any).websocketAdapter = mockWebsocketAdapter;
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(true);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockWebsocketAdapter.disconnect.mockImplementation(() => {
        throw new Error("Disconnect error");
      });

      client.disconnect();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Disconnection error:",
        expect.any(Error)
      );
    });
  });

  describe("isSocketActive", () => {
    it("should return false if websocket adapter is null", () => {
      // Set websocketAdapter to null
      Object.defineProperty(client, "websocketAdapter", {
        value: null,
        writable: true,
      });

      // @ts-ignore: Accessing private method for testing
      const result = client["isSocketActive"]();

      expect(result).toBe(false);
    });

    it("should return true if socket is open", () => {
      (client as any).websocketAdapter = mockWebsocketAdapter;
      mockWebsocketAdapter.socket.readyState = WebSocket.OPEN;

      // @ts-ignore: Accessing private method for testing
      const result = client["isSocketActive"]();

      expect(result).toBe(true);
    });

    it("should return true if socket is connecting", () => {
      (client as any).websocketAdapter = mockWebsocketAdapter;
      mockWebsocketAdapter.socket.readyState = WebSocket.CONNECTING;

      // @ts-ignore: Accessing private method for testing
      const result = client["isSocketActive"]();

      expect(result).toBe(true);
    });

    it("should return false if socket is closed", () => {
      (client as any).websocketAdapter = mockWebsocketAdapter;
      mockWebsocketAdapter.socket.readyState = WebSocket.CLOSED;

      // @ts-ignore: Accessing private method for testing
      const result = client["isSocketActive"]();

      expect(result).toBe(false);
    });
  });

  describe("setOnline", () => {
    it("should connect if online is true", async () => {
      const connectSpy = jest.spyOn(client, "connect").mockResolvedValue();

      await client.setOnline(true);

      expect(connectSpy).toHaveBeenCalled();
    });

    it("should disconnect if online is false", async () => {
      const disconnectSpy = jest.spyOn(client, "disconnect");

      await client.setOnline(false);

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe("getActiveUsers", () => {
    it("should connect and get active users", async () => {
      (client as any).websocketAdapter = mockWebsocketAdapter;
      const connectSpy = jest.spyOn(client, "connect").mockResolvedValue();
      const mockActiveUsers = ["user1", "user2"];

      jest
        .spyOn(UserPresenceMonitor.prototype, "getActiveUsers")
        .mockResolvedValue(mockActiveUsers);

      const result = await client.getActiveUsers();

      expect(connectSpy).toHaveBeenCalled();
      expect(mockRepo.find).toHaveBeenCalledWith(mockDocId);
      expect(UserPresenceMonitor.prototype.getActiveUsers).toHaveBeenCalledWith(
        mockHandle
      );
      expect(result).toEqual(mockActiveUsers);
    });

    it("should throw ActiveUsersError if getting active users fails", async () => {
      (client as any).websocketAdapter = mockWebsocketAdapter;
      const connectSpy = jest.spyOn(client, "connect").mockResolvedValue();

      jest
        .spyOn(UserPresenceMonitor.prototype, "getActiveUsers")
        .mockRejectedValue(new ActiveUsersError("Error getting active users"));

      await expect(client.getActiveUsers()).rejects.toThrow(ActiveUsersError);
      await expect(client.getActiveUsers()).rejects.toThrow(
        "Error getting active users"
      );

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe("deleteDoc", () => {
    it("should delete the document from the repository", () => {
      client.deleteDoc();

      expect(mockRepo.delete).toHaveBeenCalledWith(mockDocId);
    });
  });

  describe("getLocalMergePreview", () => {
    it("should get local merge preview", async () => {
      const mockDoc = {};
      const mockChanges = [{}];
      mockHandle.doc.mockResolvedValue(mockDoc);

      getLocalMergePreview.mockResolvedValue({
        doc: mockDoc,
        changes: mockChanges,
      });

      const result = await client.getLocalMergePreview();

      expect(mockHandle.doc).toHaveBeenCalled();
      expect(getLocalMergePreview).toHaveBeenCalledWith({
        localDoc: mockDoc,
        docId: mockDocId,
      });
      expect(result).toEqual({
        doc: mockDoc,
        changes: mockChanges,
      });
    });

    it("should return null values if local doc is null", async () => {
      mockHandle.doc.mockResolvedValue(null);

      const result = await client.getLocalMergePreview();

      expect(result).toEqual({
        doc: null,
        changes: null,
      });
    });
  });

  describe("getMergeRequestPreview", () => {
    it("should get merge request preview", async () => {
      const mockChanges = [{}];
      const mockDoc = {};

      getMergeRequestPreview.mockResolvedValue(mockDoc);

      const result = await client.getMergeRequestPreview(mockChanges);

      expect(getMergeRequestPreview).toHaveBeenCalledWith(
        mockChanges,
        mockDocId
      );
      expect(result).toBe(mockDoc);
    });
  });

  describe("removeLocalDoc", () => {
    it("should remove the document from storage", async () => {
      await client.removeLocalDoc();

      expect(mockRepo.storageSubsystem.removeDoc).toHaveBeenCalledWith(
        mockDocId
      );
    });
  });

  describe("isConnected", () => {
    it("should return true if socket is active", () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(true);

      const result = client.isConnected();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if socket is not active", () => {
      const isSocketActiveSpy = jest
        .spyOn(client as any, "isSocketActive")
        .mockReturnValue(false);

      const result = client.isConnected();

      expect(isSocketActiveSpy).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("initializeRepo", () => {
    it("should call initialize method", async () => {
      const initializeSpy = jest
        .spyOn(client, "initialize")
        .mockResolvedValue(mockHandle as any);

      const result = await client.initializeRepo();

      expect(initializeSpy).toHaveBeenCalled();
      expect(result).toBe(mockHandle);
    });
  });
});
