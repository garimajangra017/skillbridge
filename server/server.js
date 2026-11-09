
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { initializeSocket } = require("./socket/socket");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res.json({
    success: true,
    message: "SkillBridge API is running"
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "API route not found"
  })
);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
});

const io = initializeSocket(server, CLIENT_URL);
app.set("io", io);

async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, () =>
      console.log(`SkillBridge server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
