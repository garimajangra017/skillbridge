const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (error) { res.status(500).json({ message: "Could not load notifications" }); }
};

exports.markRead = async (req, res) => {
  try {
    const item = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }, { new: true }
    );
    if (!item) return res.status(404).json({ message: "Notification not found" });
    res.json(item);
  } catch (error) { res.status(400).json({ message: "Could not update notification" }); }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) { res.status(500).json({ message: "Could not update notifications" }); }
};
