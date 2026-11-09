const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  avatar: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  role: { type: String, default: "Student" },
  passwordResetToken: { type: String, default: null, select: false },
  passwordResetExpires: { type: Date, default: null, select: false }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
