const DocHandle = jest.fn().mockImplementation(() => ({
  whenReady: jest.fn().mockResolvedValue(undefined),
  doc: jest.fn().mockResolvedValue({}),
  state: "ready",
  on: jest.fn(),
  removeListener: jest.fn(),
}));

const Repo = jest.fn().mockImplementation(() => ({
  find: jest.fn().mockResolvedValue(new DocHandle()),
  networkSubsystem: {
    addNetworkAdapter: jest.fn(),
    whenReady: jest.fn().mockResolvedValue(undefined),
  },
  storageSubsystem: {
    removeDoc: jest.fn(),
  },
  delete: jest.fn(),
}));

// Mock all other exports
module.exports = {
  DocHandle,
  Repo,
  AnyDocumentId: jest.fn(),
  PeerId: jest.fn(),
  DocumentId: jest.fn(),
  NetworkAdapterInterface: jest.fn(),
};
