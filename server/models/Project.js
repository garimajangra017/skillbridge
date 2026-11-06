const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  technologies: { type: [String], default: [] },
  techStack: { type: [String], default: [] },
  image: { type: String, default: "" },
  github: { type: String, default: "" },
  liveDemo: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
