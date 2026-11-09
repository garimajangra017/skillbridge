import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useAuth from "../hooks/useAuth.js";
import { getProjects, likeProject, deleteProject } from "../services/projectService.js";

const Projects = () => {
const { user } = useAuth();
const [projects, setProjects] = useState([]);
const [search, setSearch] = useState("");
const [error, setError] = useState("");

const load = useCallback(async () => {
try {
const data = await getProjects();
setProjects(Array.isArray(data) ? data : data.projects || []);
} catch (err) {
setError(err.message);
}
}, []);

useEffect(() => {
load();
}, [load]);

const handleLike = async (project) => {
try {
await likeProject(project._id);
await load();
} catch (err) {
setError(err.message);
}
};

const handleDelete = async (project) => {
if (!window.confirm(`Delete "${project.title}"?`)) return;

```
try {
  await deleteProject(project._id);
  await load();
} catch (err) {
  setError(err.message);
}
```

};

const filtered = projects.filter((project) =>
`${project.title} ${project.description} ${(project.techStack || []).join(" ")}`
.toLowerCase()
.includes(search.toLowerCase())
);

return ( <section className="page-section"> <div className="page-heading-row"> <div><h2>Student projects</h2><p>Discover what the community is building.</p></div> <Link to="/projects/create">Create project</Link> </div> <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
{error && <p role="alert">{error}</p>} <div className="project-grid">
{filtered.map((project) => (
<ProjectCard
key={project._id}
project={project}
currentUser={user}
onLike={user ? handleLike : undefined}
onDelete={user ? handleDelete : undefined}
/>
))} </div>
{!filtered.length && !error && <EmptyState title="No projects found" description="Try a different search or create a project." />} </section>
);
};

export default Projects;
