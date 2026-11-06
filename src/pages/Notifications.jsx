import { useEffect, useState } from "react";
import {
getNotifications,
markNotificationRead,
markAllNotificationsRead,
deleteNotification
} from "../services/notificationService.js";
import NotificationItem from "../components/NotificationItem.jsx";

const Notifications = () => {
const [items, setItems] = useState([]);
const [error, setError] = useState("");

const load = async () => {
try {
const data = await getNotifications();
setItems(Array.isArray(data) ? data : data.notifications || []);
setError("");
} catch (err) {
setError(err.message);
}
};

useEffect(() => {
load();
}, []);

const markRead = async (id) => {
try {
await markNotificationRead(id);
setItems((current) => current.map((item) =>
item._id === id ? { ...item, read: true } : item
));
} catch (err) {
setError(err.message);
}
};

const markAllRead = async () => {
try {
await markAllNotificationsRead();
setItems((current) => current.map((item) => ({ ...item, read: true })));
} catch (err) {
setError(err.message);
}
};

const remove = async (id) => {
try {
await deleteNotification(id);
setItems((current) => current.filter((item) => item._id !== id));
} catch (err) {
setError(err.message);
}
};

return ( <section className="page-section"> <div className="page-heading-row"> <h2>Notifications</h2> <button type="button" onClick={markAllRead}>Mark all as read</button> </div>
{error && <p role="alert">{error}</p>}
{items.map((item) => ( <NotificationItem key={item._id} notification={item} onRead={markRead} onDelete={remove} />
))}
{!items.length && !error && <p>No notifications yet.</p>} </section>
);
};

export default Notifications;
