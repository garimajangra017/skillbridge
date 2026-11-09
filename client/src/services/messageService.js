import { apiRequest } from "./api.js";

export const getMessages = (userId) =>
apiRequest(`/messages?userId=${encodeURIComponent(userId)}`);

export const sendMessage = (receiverId, text) =>
apiRequest("/messages", {
method: "POST",
body: JSON.stringify({ receiverId, text })
});
