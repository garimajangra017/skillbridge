import { apiRequest } from "./api.js";

export const getStudents = () => apiRequest("/users");

export const getStudent = (id) => apiRequest(`/users/${id}`);

export const getMyProfile = () => apiRequest("/users/me");

export const updateMyProfile = (profile) =>
apiRequest("/users/me", {
method: "PUT",
body: JSON.stringify(profile)
});
