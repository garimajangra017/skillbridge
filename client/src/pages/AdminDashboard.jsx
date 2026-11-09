
import { Link } from "react-router-dom";

const stats = [
  { title: "Total Students", value: "—", icon: "👩‍🎓" },
  { title: "Total Projects", value: "—", icon: "🚀" },
  { title: "Active Users", value: "—", icon: "🟢" },
  { title: "Reports", value: "—", icon: "📋" }
];

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage SkillBridge from one place.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <span className="stat-icon">{stat.icon}</span>
            <div>
              <p>{stat.title}</p>
              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2>Quick Actions</h2>
        <div className="admin-actions">
          <Link to="/explore" className="admin-action-card">
            <span>🔎</span>
            <h3>Explore Students</h3>
            <p>Browse student profiles and skills.</p>
          </Link>

          <Link to="/projects" className="admin-action-card">
            <span>🚀</span>
            <h3>View Projects</h3>
            <p>Browse projects shared on SkillBridge.</p>
          </Link>

          <Link to="/dashboard" className="admin-action-card">
            <span>📊</span>
            <h3>Main Dashboard</h3>
            <p>Return to the student dashboard.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;