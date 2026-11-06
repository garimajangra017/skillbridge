const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const otherId = req.params.userId || req.query.userId;
    if (!otherId) return res.status(400).json({ message: "userId is required" });
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherId },
        { sender: otherId, receiver: req.user._id }
      ]
    }).populate("sender", "name avatar").populate("receiver", "name avatar").sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) { res.status(400).json({ message: "Could not load messages" }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const receiver = req.body.receiver || req.body.receiverId || req.body.userId;
    const text = req.body.text || req.body.message;
    if (!receiver || !text || !String(text).trim()) return res.status(400).json({ message: "Receiver and message text are required" });
    const message = await Message.create({ sender: req.user._id, receiver, text: String(text).trim() });
    await message.populate("sender receiver", "name avatar");
    const io = req.app.get("io");
    if (io) io.to(String(receiver)).emit("new_message", message);
    res.status(201).json(message);
  } catch (error) { res.status(400).json({ message: "Could not send message" }); }
};
