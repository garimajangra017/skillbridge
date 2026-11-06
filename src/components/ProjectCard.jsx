const ProjectCard = ({ project, onLike, onDelete, currentUser }) => {
const ownerId = project.owner?._id || project.ownerId || project.owner;
const ownerName = project.owner?.name || project.ownerName || "Student";
const liked = (project.likes || []).some((id) =>
String(id?._id || id) === String(currentUser?._id || currentUser?.id)
);

return ( <article className="project-card"> <div className="project-card-header"> <span className="project-category">{project.category || "Other"}</span> <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}</span> </div> <h3>{project.title}</h3> <p>{project.description}</p> <div className="project-technologies">
{(project.techStack || []).map((tech) => ( <span className="skill-badge" key={tech}>{tech}</span>
))} </div> <p className="project-owner">Created by {ownerName}</p> <div className="project-card-actions">
{project.github && ( <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>
)}
{project.liveDemo && ( <a href={project.liveDemo} target="_blank" rel="noreferrer">Live demo</a>
)}
{onLike && (
<button type="button" onClick={() => onLike(project)}>
{liked ? "♥" : "♡"} {project.likesCount ?? project.likes?.length ?? 0} </button>
)}
{onDelete && String(ownerId) === String(currentUser?._id || currentUser?.id) && (
<button type="button" onClick={() => onDelete(project)}>
Delete </button>
)} </div> </article>
);
};

export default ProjectCard;
