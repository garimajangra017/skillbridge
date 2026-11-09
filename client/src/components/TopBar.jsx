import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const TopBar = ({ title = "SkillBridge" }) => {
  const { user, logout } = useContext(AuthContext);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName =
    user?.name || user?.fullName || user?.username || "Student";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="app-topbar">
      <div className="topbar-heading">
        <span className="topbar-kicker">SKILLBRIDGE / WORKSPACE</span>
        <h1>{title}</h1>
        <span className="topbar-date">{today}</span>
      </div>

      <div className="topbar-actions">
        <Link
          to="/notifications"
          className="topbar-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          ♧
        </Link>

        <div className="topbar-divider" />

        <Link to="/profile" className="topbar-profile">
          <span className="topbar-avatar">{initials || "S"}</span>
          <span className="topbar-profile-info">
            <strong>{displayName}</strong>
            <small>{user?.role || "Student"}</small>
          </span>
        </Link>

        <button
          type="button"
          className="topbar-logout"
          onClick={logout}
          title="Log out"
        >
          <span>↪</span>
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;