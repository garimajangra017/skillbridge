const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
function publicUser(user) {
  return {
    _id: user._id, id: user._id, name: user.name, email: user.email,
    bio: user.bio, skills: user.skills || [], avatar: user.avatar,
    github: user.github, linkedin: user.linkedin, role: user.role
  };
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required." });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    const normalizedEmail = String(email).toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "An account with this email already exists." });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashed });
    res.status(201).json({ success: true, message: "Account created successfully.", token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Registration failed." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password." });
    res.json({ success: true, message: "Login successful.", token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

exports.me = (req, res) => res.json({ success: true, user: publicUser(req.user) });
