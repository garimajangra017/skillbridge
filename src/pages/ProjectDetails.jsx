
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProjectDetails = () => {
  const { id, projectId } = useParams();
  const currentId = projectId || id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      if (!currentId) {
        setError("Project ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/projects/${encodeURIComponent(currentId)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json"
            }
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to load project details.");
        }

        setProject(data.project || data.data || data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => controller.abort();
  }, [currentId]);

  if (loading) {
    return (
      <div className="project-details">
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-details">
        <h2>Project details unavailable</h2>
        <p>{error}</p>
        <Link to="/projects">Back to Projects</Link>
      </div>
    );
  }

  if (!project || typeof project !== "object") {
    return (
      <div className="project-details">
        <h2>Project not found</h2>
        <Link to="/projects">Back to Projects</Link>
      </div>
    );
  }

  const title = project.title || project.name || "Untitled Project";
  const description = project.description || "No description available.";
  const skills = Array.isArray(project.skills)
    ? project.skills
    : Array.isArray(project.technologies)
      ? project.technologies
      : [];
  const owner = project.owner?.name || project.createdBy?.name || project.author?.name || "Student";
  const status = project.status || "Open";

  return (
    <div className="project-details">
      <div className="project-details-header">
        <Link to="/projects">← Back to Projects</Link>
        <span className="project-status">{status}</span>
      </div>

      <section className="project-details-content">
        <h1>{title}</h1>
        <p className="project-owner">Created by {owner}</p>

        <div className="project-description">
          <h2>About this project</h2>
          <p>{description}</p>
        </div>

        <div className="project-skills">
          <h2>Skills and Technologies</h2>
          {skills.length > 0 ? (
            <div className="project-skill-list">
              {skills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>No skills listed.</p>
          )}
        </div>

        {project.githubUrl && (
          <p>
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              View GitHub Repository
            </a>
          </p>
        )}

        {project.liveUrl && (
          <p>
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              View Live Project
            </a>
          </p>
        )}
      </section>
    </div>
  );
};

export default ProjectDetails;