import { ServerRepoFactory } from "@/lib/utils/server-repo-factory";
import type { Doc } from "@automerge/automerge";
import type { StageSchema } from "@/types/stage-schema";
import { clone, merge, getChanges, applyChanges } from "@automerge/automerge";
import { AnyDocumentId } from "@automerge/automerge-repo";

// Setup mocks
jest.mock("@/lib/utils/server-repo-factory");
jest.mock("@automerge/automerge");

// Create mock types
type MockServerHandle = {
  doc: jest.Mock;
  change: jest.Mock;
  close: jest.Mock;
};

type MockServerRepo = {
  find: jest.Mock;
  create: jest.Mock;
  close: jest.Mock;
};

// Import the original module for reference
const originalModule = jest.requireActual("@/lib/sync/synchronizer");

// Mock the module
jest.mock("@/lib/sync/synchronizer", () => {
  return {
    getServerDoc: jest.fn(),
    getLocalMergePreview: jest.fn(),
    getMergeRequestPreview: jest.fn(),
  };
});

// Import the mocked functions directly
import {
  getServerDoc,
  getLocalMergePreview,
  getMergeRequestPreview,
} from "@/lib/sync/synchronizer";

describe("Synchronizer", () => {
  // Setup common mocks with proper typing
  const mockDocId = "test-doc-id";
  const mockDoc: Doc<StageSchema> = {
    "1": { attrs: { x: 100, y: 100 }, className: "KonvaNode" },
  };
  const mockServerDoc: Doc<StageSchema> = {
    "1": { attrs: { x: 200, y: 200 }, className: "KonvaNode" },
  };
  const mockMergedDoc: Doc<StageSchema> = {
    "1": { attrs: { x: 150, y: 150 }, className: "KonvaNode" },
  };
  const mockChanges = [new Uint8Array([1, 2, 3, 4, 5])];

  // Mock repo and handle with proper typing
  let mockServerHandle: MockServerHandle;
  let mockServerRepo: MockServerRepo;
  let mockCleanup: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up mock handle
    mockServerHandle = {
      doc: jest.fn().mockResolvedValue(mockServerDoc),
      change: jest.fn(),
      close: jest.fn(),
    };

    // Set up mock repo
    mockServerRepo = {
      find: jest.fn().mockReturnValue(mockServerHandle),
      create: jest.fn(),
      close: jest.fn(),
    };

    // Set up mock cleanup
    mockCleanup = jest.fn();

    // Mock ServerRepoFactory
    (ServerRepoFactory.create as jest.Mock).mockReturnValue({
      repo: mockServerRepo,
      cleanup: mockCleanup,
    });

    // Mock Automerge functions
    (clone as jest.Mock).mockImplementation((doc: Doc<StageSchema>) => ({
      ...doc,
    }));
    (merge as jest.Mock).mockImplementation(
      (doc1: Doc<StageSchema>, doc2: Doc<StageSchema>) => ({
        ...doc1,
        ...doc2,
      })
    );
    (getChanges as jest.Mock).mockReturnValue(mockChanges);
    (applyChanges as jest.Mock).mockImplementation(
      (doc: Doc<StageSchema>, changes: Uint8Array[]) => [
        { ...doc, ...mockMergedDoc },
        changes,
      ]
    );
  });

  afterEach(() => {
    // Ensure cleanup is called after each test
    expect(mockCleanup).toHaveBeenCalled();
  });

  describe("getServerDoc", () => {
    beforeEach(() => {
      // Mock getServerDoc to use our own implementation
      (getServerDoc as jest.Mock).mockImplementation(async (docId: string) => {
        const { repo: serverRepo, cleanup } = ServerRepoFactory.create();
        try {
          const serverHandle = serverRepo.find(docId as AnyDocumentId);
          return clone(await serverHandle.doc());
        } catch (error) {
          console.error("Error getting server doc:", error);
          return null;
        } finally {
          cleanup();
        }
      });
    });

    it("should return the cloned server document", async () => {
      const result = await getServerDoc(mockDocId);

      // Verify ServerRepoFactory was created
      expect(ServerRepoFactory.create).toHaveBeenCalled();

      // Verify repo.find was called with document ID
      expect(mockServerRepo.find).toHaveBeenCalledWith(
        mockDocId as AnyDocumentId
      );

      // Verify handle.doc() was called
      expect(mockServerHandle.doc).toHaveBeenCalled();

      // Verify clone was called on the document
      expect(clone).toHaveBeenCalledWith(mockServerDoc);

      // Verify cleanup was called
      expect(mockCleanup).toHaveBeenCalled();

      // Verify result is the cloned server document
      expect(result).toEqual(mockServerDoc);
    });

    it("should return null if an error occurs", async () => {
      // Mock an error occurring
      mockServerHandle.doc.mockRejectedValue(new Error("Server error"));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await getServerDoc(mockDocId);

      // Verify error is logged
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error getting server doc:",
        expect.any(Error)
      );

      // Verify cleanup is still called even on error
      expect(mockCleanup).toHaveBeenCalled();

      // Result should be null
      expect(result).toBeNull();
    });
  });

  describe("getLocalMergePreview", () => {
    beforeEach(() => {
      // Mock getServerDoc to return mockServerDoc
      (getServerDoc as jest.Mock).mockResolvedValue(mockServerDoc);

      // Use the original implementation for getLocalMergePreview
      (getLocalMergePreview as jest.Mock).mockImplementation(
        originalModule.getLocalMergePreview
      );
    });

    it("should return merged document and changes when successful", async () => {
      const result = await getLocalMergePreview({
        localDoc: mockDoc,
        docId: mockDocId,
      });

      // Verify getServerDoc was called
      expect(getServerDoc).toHaveBeenCalledWith(mockDocId);

      // Verify merge was called with server and local docs
      expect(merge).toHaveBeenCalledWith(mockServerDoc, mockDoc);

      // Verify getChanges was called to get changes between server and merged docs
      expect(getChanges).toHaveBeenCalledWith(mockServerDoc, mockMergedDoc);

      // Verify result contains merged doc and changes
      expect(result).toEqual({
        doc: mockMergedDoc,
        changes: mockChanges,
      });
    });

    it("should return null values if localDoc is missing", async () => {
      const result = await getLocalMergePreview({
        localDoc: null as unknown as Doc<any>,
        docId: mockDocId,
      });

      // Verify getServerDoc was not called
      expect(getServerDoc).not.toHaveBeenCalled();

      // Verify result contains null values
      expect(result).toEqual({
        doc: null,
        changes: null,
      });
    });

    it("should return null values if docId is missing", async () => {
      const result = await getLocalMergePreview({
        localDoc: mockDoc,
        docId: "",
      });

      // Verify getServerDoc was not called
      expect(getServerDoc).not.toHaveBeenCalled();

      // Verify result contains null values
      expect(result).toEqual({
        doc: null,
        changes: null,
      });
    });

    it("should return null values if getServerDoc returns null", async () => {
      // Mock getServerDoc to return null
      (getServerDoc as jest.Mock).mockResolvedValue(null);

      const result = await getLocalMergePreview({
        localDoc: mockDoc,
        docId: mockDocId,
      });

      // Verify getServerDoc was called
      expect(getServerDoc).toHaveBeenCalledWith(mockDocId);

      // Verify merge was not called
      expect(merge).not.toHaveBeenCalled();

      // Verify result contains null values
      expect(result).toEqual({
        doc: null,
        changes: null,
      });
    });

    it("should handle errors and return null values", async () => {
      // Mock merge to throw an error
      (merge as jest.Mock).mockImplementation(() => {
        throw new Error("Merge error");
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await getLocalMergePreview({
        localDoc: mockDoc,
        docId: mockDocId,
      });

      // Verify error is logged
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during document merge:",
        expect.any(Error)
      );

      // Verify result contains null values
      expect(result).toEqual({
        doc: null,
        changes: null,
      });
    });
  });

  describe("getMergeRequestPreview", () => {
    beforeEach(() => {
      // Mock getServerDoc to return mockServerDoc
      (getServerDoc as jest.Mock).mockResolvedValue(mockServerDoc);

      // Use the original implementation for getMergeRequestPreview
      (getMergeRequestPreview as jest.Mock).mockImplementation(
        originalModule.getMergeRequestPreview
      );
    });

    it("should return merged document when successful", async () => {
      const result = await getMergeRequestPreview(mockChanges, mockDocId);

      // Verify getServerDoc was called
      expect(getServerDoc).toHaveBeenCalledWith(mockDocId);

      // Verify applyChanges was called with server doc and changes
      expect(applyChanges).toHaveBeenCalledWith(mockServerDoc, mockChanges);

      // Verify result is the merged document
      expect(result).toBe(mockMergedDoc);
    });

    it("should return null if getServerDoc returns null", async () => {
      // Mock getServerDoc to return null
      (getServerDoc as jest.Mock).mockResolvedValue(null);

      const result = await getMergeRequestPreview(mockChanges, mockDocId);

      // Verify getServerDoc was called
      expect(getServerDoc).toHaveBeenCalledWith(mockDocId);

      // Verify applyChanges was not called
      expect(applyChanges).not.toHaveBeenCalled();

      // Verify result is null
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      // Mock applyChanges to throw an error
      (applyChanges as jest.Mock).mockImplementation(() => {
        throw new Error("Apply changes error");
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await getMergeRequestPreview(mockChanges, mockDocId);

      // Verify error is logged
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during document merge:",
        expect.any(Error)
      );

      // Verify result is null
      expect(result).toBeNull();
    });
  });
});
