
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email university course year bio skills avatar createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load profile.",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, university, course, year, avatar } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }
      updates.name = name.trim();
    }

    if (bio !== undefined) updates.bio = String(bio).slice(0, 500);
    if (university !== undefined) updates.university = String(university).slice(0, 200);
    if (course !== undefined) updates.course = String(course).slice(0, 120);
    if (year !== undefined) updates.year = String(year).slice(0, 50);
    if (avatar !== undefined) updates.avatar = String(avatar).slice(0, 1000);

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be a list.",
        });
      }
      updates.skills = skills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, 30);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("name email university course year bio skills avatar createdAt");

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not update profile.",
    });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = { _id: { $ne: req.user._id } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
      ];
    }

    const students = await User.find(filter)
      .select("name university course year bio skills avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not find students.",
    });
  }
};