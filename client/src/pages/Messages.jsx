
import { useEffect, useRef, useState } from "react";
import "./Messages.css";

const students = [
  { id: 1, name: "Aman Sharma", initials: "AS", color: "blue", online: true, course: "Computer Science", lastMessage: "Hey! How are you?" },
  { id: 2, name: "Priya Verma", initials: "PV", color: "pink", online: true, course: "Web Development", lastMessage: "Let's collaborate!" },
  { id: 3, name: "Rahul Singh", initials: "RS", color: "green", online: false, course: "Data Science", lastMessage: "Thanks for your help" },
  { id: 4, name: "Neha Gupta", initials: "NG", color: "orange", online: true, course: "UI/UX Design", lastMessage: "Nice project ✨" },
  { id: 5, name: "Arjun Kumar", initials: "AK", color: "purple", online: false, course: "Full Stack Development", lastMessage: "See you tomorrow!" }
];

const initialMessages = {
  1: [
    { id: 101, text: "Hey Garima! 👋 Welcome to SkillBridge.", from: "them", time: "10:30 AM" },
    { id: 102, text: "Hey Aman! Nice to connect with you.", from: "me", time: "10:31 AM" },
    { id: 103, text: "How is your project going? 😊", from: "them", time: "10:32 AM" }
  ],
  2: [
    { id: 201, text: "Hey Garima! 💜", from: "them", time: "09:45 AM" },
    { id: 202, text: "Let's collaborate on a project!", from: "them", time: "09:46 AM" }
  ],
  3: [
    { id: 301, text: "Thanks for your help yesterday!", from: "them", time: "Yesterday" }
  ],
  4: [
    { id: 401, text: "Your UI design looks amazing! ✨", from: "them", time: "Yesterday" }
  ],
  5: [
    { id: 501, text: "Let's connect about full-stack development.", from: "them", time: "Yesterday" }
  ]
};

function getReply(message, studentName) {
  const text = message.toLowerCase();

  if (/\b(hi|hello|hey|hii|helo)\b/.test(text)) {
    return `Hey Garima! 👋 Great to hear from you! How are you doing?`;
  }

  if (text.includes("how are you") || text.includes("kaise ho")) {
    return "I'm doing great, thank you! 😊 How about you?";
  }

  if (text.includes("project") || text.includes("skillbridge")) {
    return "That sounds exciting! 🚀 Tell me more about your project. Maybe we can collaborate!";
  }

  if (text.includes("study") || text.includes("exam") || text.includes("dsa")) {
    return "You've got this! 📚 Which topic are you working on? Let's help each other learn.";
  }

  if (text.includes("thank")) {
    return "You're always welcome! 💙 Happy to help!";
  }

  if (text.includes("help") || text.includes("problem") || text.includes("error")) {
    return "Of course! 😊 Tell me a little more about the problem. Let's figure it out together.";
  }

  if (text.includes("bye")) {
    return "See you soon! 👋 Keep learning and keep shining!";
  }

  if (text.includes("good morning")) {
    return "Good morning, Garima! ☀️ Hope you have a wonderful day!";
  }

  if (text.includes("good night")) {
    return "Good night! 🌙 Rest well and keep chasing your dreams!";
  }

  const replies = [
    `That's interesting! 😊 Tell me more, Garima.`,
    `I see what you mean! 💙 What do you think we should do next?`,
    `Nice! ✨ I'm glad we're connected on SkillBridge.`,
    `Sounds good! 🙌 Let's keep sharing ideas and learning together.`,
    `Thanks for sharing that with me! 💜`,
    `That's a good point! 😊 I'd love to hear more about it.`
  ];

  const index = (message.length + studentName.length) % replies.length;
  return replies[index];
}

export default function Messages() {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState({});
  const bottomRef = useRef(null);
  const timers = useRef([]);

  const selectedStudent = students.find(student => student.id === selectedId);

  const visibleStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.course.toLowerCase().includes(search.toLowerCase())
  );

  const currentMessages = messages[selectedId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, selectedId, typing]);

  useEffect(() => {
    return () => timers.current.forEach(timer => clearTimeout(timer));
  }, []);

  function openChat(student) {
    setSelectedId(student.id);
    setTyping(false);
    setUnread(previous => ({ ...previous, [student.id]: 0 }));
  }

  function sendMessage(event) {
    event.preventDefault();

    const text = draft.trim();
    if (!text || typing) return;

    const student = selectedStudent;
    const sentAt = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const myMessage = {
      id: Date.now(),
      text,
      from: "me",
      time: sentAt
    };

    setMessages(previous => ({
      ...previous,
      [student.id]: [...(previous[student.id] || []), myMessage]
    }));

    setDraft("");
    setTyping(true);

    const timer = setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: getReply(text, student.name),
        from: "them",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      setMessages(previous => ({
        ...previous,
        [student.id]: [...(previous[student.id] || []), reply]
      }));

      setTyping(false);
    }, 1000);

    timers.current.push(timer);
  }

  return (
    <div className="sb-messenger">
      <aside className="sb-chat-sidebar">
        <div className="sb-chat-sidebar-header">
          <div>
            <span className="sb-kicker">YOUR COMMUNITY</span>
            <h1>Messages<span className="sb-title-dot">.</span></h1>
          </div>
          <div className="sb-message-count">{students.length}</div>
        </div>

        <div className="sb-chat-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search students..."
            aria-label="Search students"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <div className="sb-contact-heading">
          <span>STUDENTS</span>
          <span>{visibleStudents.length} contacts</span>
        </div>

        <div className="sb-contact-list">
          {visibleStudents.map(student => {
            const chat = messages[student.id] || [];
            const last = chat[chat.length - 1];

            return (
              <button
                type="button"
                key={student.id}
                className={`sb-contact ${selectedId === student.id ? "active" : ""}`}
                onClick={() => openChat(student)}
              >
                <div className={`sb-avatar ${student.color}`}>
                  {student.initials}
                  {student.online && <span className="sb-online-dot" />}
                </div>

                <div className="sb-contact-details">
                  <div className="sb-contact-top">
                    <strong>{student.name}</strong>
                    <span className="sb-contact-time">{last?.time || ""}</span>
                  </div>
                  <div className="sb-contact-bottom">
                    <span>{last?.text || student.lastMessage}</span>
                    {unread[student.id] > 0 && (
                      <span className="sb-unread">{unread[student.id]}</span>
                    )}
                  </div>
                  <span className={`sb-presence ${student.online ? "online" : ""}`}>
                    {student.online ? "● Online" : "Offline"}
                  </span>
                </div>
              </button>
            );
          })}

          {visibleStudents.length === 0 && (
            <div className="sb-no-contacts">
              <span>⌕</span>
              <p>No students found</p>
              <small>Try another name or course.</small>
            </div>
          )}
        </div>

        <div className="sb-sidebar-note">
          <span>✦</span>
          <div>
            <strong>Learn together</strong>
            <p>Great ideas start with a conversation.</p>
          </div>
        </div>
      </aside>

      <section className="sb-conversation">
        <header className="sb-conversation-header">
          <div className={`sb-avatar sb-header-avatar ${selectedStudent.color}`}>
            {selectedStudent.initials}
            {selectedStudent.online && <span className="sb-online-dot" />}
          </div>

          <div className="sb-header-info">
            <h2>{selectedStudent.name}</h2>
            <span className={`sb-presence ${selectedStudent.online ? "online" : ""}`}>
              {selectedStudent.online ? "● Online now" : "Offline"}
            </span>
            <small>{selectedStudent.course}</small>
          </div>

          <div className="sb-header-actions">
            <span title="Search contacts">✦</span>
            <span title="More options">⋮</span>
          </div>
        </header>

        <div className="sb-chat-notice">
          <span>🔒</span>
          <span>Welcome to your SkillBridge conversation space.</span>
        </div>

        <div className="sb-chat-history">
          <div className="sb-date-divider"><span>TODAY</span></div>

          {currentMessages.map(message => (
            <div
              key={message.id}
              className={`sb-message-line ${message.from === "me" ? "mine" : "theirs"}`}
            >
              {message.from === "them" && (
                <div className={`sb-avatar sb-small-avatar ${selectedStudent.color}`}>
                  {selectedStudent.initials}
                </div>
              )}

              <div className="sb-message-content">
                <div className="sb-bubble">
                  <p>{message.text}</p>
                </div>
                <div className="sb-message-meta">
                  <span>{message.time}</span>
                  {message.from === "me" && <span className="sb-checks">✓✓</span>}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="sb-message-line theirs">
              <div className={`sb-avatar sb-small-avatar ${selectedStudent.color}`}>
                {selectedStudent.initials}
              </div>
              <div className="sb-typing-bubble" aria-label="Preparing automatic reply">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form className="sb-compose" onSubmit={sendMessage}>
          <span className="sb-compose-spark">✧</span>
          <input
            value={draft}
            onChange={event => setDraft(event.target.value)}
            placeholder={`Message ${selectedStudent.name.split(" ")[0]}...`}
            aria-label="Write a message"
            maxLength={2000}
          />
          <span className="sb-compose-hint">Enter ↵</span>
          <button type="submit" disabled={!draft.trim() || typing} aria-label="Send message">
            <span>➤</span>
          </button>
        </form>

        <div className="sb-demo-note">
          <span>✦</span> Demo chat · Automatic sample replies
        </div>
      </section>
    </div>
  );
}