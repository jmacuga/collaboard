const BrowserWebSocketClientAdapter = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  socket: {
    readyState: 1, // WebSocket.OPEN
    close: jest.fn(),
  },
}));

module.exports = {
  BrowserWebSocketClientAdapter,
};
