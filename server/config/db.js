const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGODB_URI is missing. Server will start, but database features will not work.");
    return;
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

module.exports = connectDB;
