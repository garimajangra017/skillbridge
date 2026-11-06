const MessageBubble = ({ message, isOwn = false }) => (

  <div className={`message-row ${isOwn ? "message-row-own" : ""}`}>
    <div className={`message-bubble ${isOwn ? "message-bubble-own" : ""}`}>
      <p>{message.text}</p>
      <time>
        {message.createdAt
          ? new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          : ""}
      </time>
    </div>
  </div>
);

export default MessageBubble;
