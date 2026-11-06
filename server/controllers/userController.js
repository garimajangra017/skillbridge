const User = require("../models/User");
const Project = require("../models/Project");

const formatUser = (user) => ({
  _id: user._id, id: user._id, name: user.name, email: user.email,
  bio: user.bio, skills: user.skills || [], avatar: user.avatar,
  github: user.github, linkedin: user.linkedin, role: user.role,
  createdAt: user.createdAt
});

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email bio skills avatar github linkedin role createdAt").sort({ createdAt: -1 });
    res.json(users.map(formatUser));
  } catch (error) { res.status(500).json({ message: "Could not load students" }); }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email bio skills avatar github linkedin role createdAt");
    if (!user) return res.status(404).json({ message: "Student not found" });
    const projects = await Project.find({ owner: user._id }).populate("owner", "name avatar").sort({ createdAt: -1 });
    res.json({ user: formatUser(user), projects });
  } catch (error) { res.status(400).json({ message: "Could not load student profile" }); }
};

exports.getMyProfile = (req, res) => res.json({ user: formatUser(req.user) });

exports.updateMyProfile = async (req, res) => {
  try {
    const allowed = ["name", "bio", "skills", "avatar", "github", "linkedin"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    if (typeof updates.name === "string") {
      updates.name = updates.name.trim();
      if (!updates.name) return res.status(400).json({ message: "Name is required" });
    }
    if (typeof updates.skills === "string") updates.skills = updates.skills.split(",").map(s => s.trim()).filter(Boolean);
    if (updates.skills !== undefined && !Array.isArray(updates.skills)) return res.status(400).json({ message: "Skills must be a list" });
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
    res.json({ message: "Profile updated successfully", user: formatUser(user) });
  } catch (error) { res.status(500).json({ message: "Could not update profile" }); }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: "You cannot delete your own account from this page" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Student not found" });
    await Project.deleteMany({ owner: user._id });
    res.json({ message: "Student and their projects deleted" });
  } catch (error) { res.status(400).json({ message: "Could not delete student" }); }
};
