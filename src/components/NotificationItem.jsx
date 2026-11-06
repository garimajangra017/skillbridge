const NotificationItem = ({ notification, onRead, onDelete }) => (

  <article className={`notification-item ${notification.read ? "" : "notification-unread"}`}>
    <div className="notification-content">
      <h3>{notification.title}</h3>
      <p>{notification.text}</p>
      <time>
        {notification.createdAt
          ? new Date(notification.createdAt).toLocaleString()
          : ""}
      </time>
    </div>
    <div className="notification-actions">
      {!notification.read && (
        <button type="button" onClick={() => onRead?.(notification._id)}>
          Mark read
        </button>
      )}
      <button type="button" onClick={() => onDelete?.(notification._id)}>
        Delete
      </button>
    </div>
  </article>
);

export default NotificationItem;
