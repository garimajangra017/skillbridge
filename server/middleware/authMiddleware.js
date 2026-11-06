const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Please log in to continue." });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "JWT_SECRET is not configured." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Account not found." });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session is invalid or expired. Please log in again." });
  }
};
