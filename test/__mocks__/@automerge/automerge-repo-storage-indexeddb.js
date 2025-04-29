const IndexedDBStorageAdapter = jest.fn().mockImplementation(() => ({
  load: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue(undefined),
  removeDoc: jest.fn().mockResolvedValue(undefined),
}));

module.exports = {
  IndexedDBStorageAdapter,
};
