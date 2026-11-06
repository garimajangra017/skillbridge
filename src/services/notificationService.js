import { apiRequest } from "./api.js";

export const getNotifications = () => apiRequest("/notifications");

export const markNotificationRead = (id) =>
apiRequest(`/notifications/${id}/read`, {
method: "PATCH"
});

export const markAllNotificationsRead = () =>
apiRequest("/notifications/read-all", {
method: "PATCH"
});

export const deleteNotification = (id) =>
apiRequest(`/notifications/${id}`, {
method: "DELETE"
});
