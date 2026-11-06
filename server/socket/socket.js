const { Server } = require("socket.io");

function initializeSocket(server, clientUrl) {
  const io = new Server(server, {
    cors: { origin: clientUrl || "http://localhost:5173", methods: ["GET", "POST"], credentials: true }
  });
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (userId) socket.join(String(userId));
    });
    socket.on("join_room", (roomId) => {
      if (roomId) socket.join(String(roomId));
    });
  });
  return io;
}

module.exports = { initializeSocket };
