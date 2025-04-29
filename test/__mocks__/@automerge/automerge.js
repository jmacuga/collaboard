const Doc = jest.fn();
const Change = jest.fn();
const clone = jest.fn().mockImplementation((doc) => doc);
const merge = jest.fn().mockImplementation((doc1, doc2) => doc1);
const getChanges = jest.fn().mockReturnValue([]);
const applyChanges = jest.fn().mockImplementation((doc) => [doc]);

module.exports = {
  Doc,
  Change,
  clone,
  merge,
  getChanges,
  applyChanges,
};
