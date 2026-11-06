import { apiRequest } from "./api.js";

export const getProjects = () => apiRequest("/projects");

export const createProject = (project) =>
apiRequest("/projects", {
method: "POST",
body: JSON.stringify(project)
});

export const likeProject = (id) =>
apiRequest(`/projects/${id}/like`, {
method: "POST"
});

export const deleteProject = (id) =>
apiRequest(`/projects/${id}`, {
method: "DELETE"
});
