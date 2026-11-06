import User from "../models/User.js";
import Project from "../models/Project.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

export const getAdminStats = async (req, res) => {
try {
const [users, projects, messages, notifications] = await Promise.all([
User.countDocuments(),
Project.countDocuments(),
Message.countDocuments(),
Notification.countDocuments()
]);

```
res.json({ users, projects, messages, notifications });
```

} catch {
res.status(500).json({ message: "Could not load admin statistics" });
}
};

export const getAdminUsers = async (req, res) => {
try {
const users = await User.find()
.select("name email role createdAt")
.sort({ createdAt: -1 });

```
res.json(users);
```

} catch {
res.status(500).json({ message: "Could not load users" });
}
};

export const updateUserRole = async (req, res) => {
try {
const { role } = req.body;

```
if (!["Student", "Admin"].includes(role)) {
  return res.status(400).json({
    message: "Role must be Student or Admin"
  });
}

if (req.params.id === req.user._id.toString()) {
  return res.status(400).json({
    message: "You cannot change your own role"
  });
}

const user = await User.findByIdAndUpdate(
  req.params.id,
  { $set: { role } },
  { new: true, runValidators: true }
).select("name email role");

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

res.json({ message: "User role updated", user });
```

} catch {
res.status(400).json({ message: "Could not update user role" });
}
};

export const getAdminProjects = async (req, res) => {
try {
const projects = await Project.find()
.populate("owner", "name email")
.sort({ createdAt: -1 });

```
res.json(projects);
```

} catch {
res.status(500).json({ message: "Could not load projects" });
}
};

export const deleteAdminProject = async (req, res) => {
try {
const project = await Project.findByIdAndDelete(req.params.id);

```
if (!project) {
  return res.status(404).json({ message: "Project not found" });
}

res.json({ message: "Project deleted successfully" });
```

} catch {
res.status(400).json({ message: "Could not delete project" });
}
};
