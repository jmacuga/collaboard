const connectWebSocket = () => {
  const ws = new WebSocket("ws://localhost:3000/api/socket");

  ws.onerror = (error) => {
    console.log("WebSocket error, retrying in 1 second...");
    setTimeout(() => {
      connectWebSocket();
    }, 1000);
  };

  ws.onopen = () => {
    console.log("WebSocket connected successfully");
    // Your existing onopen logic
  };

  ws.onmessage = (event) => {
    console.log("Received from server:", event.data);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return ws;
};

export default connectWebSocket;
