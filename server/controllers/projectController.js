const Project = require("../models/Project");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("owner", "name avatar").sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) { res.status(500).json({ message: "Could not load projects" }); }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("owner", "name avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) { res.status(400).json({ message: "Invalid project ID" }); }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, category, technologies, techStack, image, github, liveDemo } = req.body;
    if (!title) return res.status(400).json({ message: "Project title is required" });
    const stack = technologies || techStack || [];
    const project = await Project.create({
      title, description, category, technologies: Array.isArray(stack) ? stack : String(stack).split(",").map(s => s.trim()).filter(Boolean),
      techStack: Array.isArray(stack) ? stack : String(stack).split(",").map(s => s.trim()).filter(Boolean),
      image, github, liveDemo, owner: req.user._id
    });
    await project.populate("owner", "name avatar");
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) { res.status(500).json({ message: error.message || "Could not create project" }); }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.owner) !== String(req.user._id)) return res.status(403).json({ message: "Not authorized" });
    Object.assign(project, req.body);
    await project.save();
    await project.populate("owner", "name avatar");
    res.json({ message: "Project updated", project });
  } catch (error) { res.status(400).json({ message: "Could not update project" }); }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.owner) !== String(req.user._id)) return res.status(403).json({ message: "Not authorized" });
    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) { res.status(400).json({ message: "Could not delete project" }); }
};

exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    const liked = project.likes.some(id => String(id) === String(req.user._id));
    if (liked) project.likes.pull(req.user._id); else project.likes.push(req.user._id);
    await project.save();
    res.json({ likes: project.likes.length, liked: !liked });
  } catch (error) { res.status(400).json({ message: "Could not update like" }); }
};
