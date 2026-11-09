
import { NavLink } from "react-router-dom";

const navigation = [
  {
    title: "WORKSPACE",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: "⌂" },
      { to: "/explore", label: "Explore Students", icon: "◎" },
      { to: "/projects", label: "Projects", icon: "▤" },
    ],
  },
  {
    title: "COMMUNICATION",
    links: [
      { to: "/messages", label: "Messages", icon: "✉" },
      { to: "/notifications", label: "Notifications", icon: "♧" },
    ],
  },
  {
    title: "PERSONAL",
    links: [
      { to: "/profile", label: "My Profile", icon: "◉" },
      { to: "/settings", label: "Settings", icon: "⚙" },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <NavLink to="/dashboard" className="sidebar-brand">
        <span className="sidebar-logo">S</span>
        <span className="sidebar-brand-text">
          Skill<span>Bridge</span>
          <small>STUDENT COMMUNITY</small>
        </span>
      </NavLink>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        {navigation.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <p className="sidebar-section-title">{section.title}</p>

            {section.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="sidebar-link-icon" aria-hidden="true">
                  {link.icon}
                </span>
                <span className="sidebar-link-label">{link.label}</span>
                {link.to === "/dashboard" && (
                  <span className="sidebar-active-indicator" />
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <span className="sidebar-tip-icon">✦</span>
          <strong>Keep growing!</strong>
          <p>Your next big opportunity could start with one connection.</p>
          <NavLink to="/explore">Explore community ↗</NavLink>
        </div>

        <NavLink to="/profile" className="sidebar-user">
          <span className="sidebar-user-avatar">GJ</span>
          <span className="sidebar-user-info">
            <strong>Garima Jangra</strong>
            <small>Student · SkillBridge</small>
          </span>
          <span className="sidebar-user-menu">···</span>
        </NavLink>

        <div className="sidebar-version">SKILLBRIDGE © 2026</div>
      </div>
    </aside>
  );
};

export default Sidebar;
