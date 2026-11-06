import { apiRequest } from "./api.js";

export const registerUser = (details) =>
apiRequest("/auth/register", {
method: "POST",
body: JSON.stringify(details)
});

export const loginUser = (details) =>
apiRequest("/auth/login", {
method: "POST",
body: JSON.stringify(details)
});

export const getCurrentUser = () =>
apiRequest("/auth/me");

export const logoutUser = () => {
localStorage.removeItem("skillbridge_token");
localStorage.removeItem("skillbridge_user");
};
