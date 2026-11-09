
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { getProjects } from "../services/projectService.js";

const getProjectList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.projects)) return result.projects;
  if (Array.isArray(result?.data?.projects)) return result.data.projects;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};

const getStatus = (project) =>
  String(project?.status || project?.projectStatus || "pending").toLowerCase();

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const result = await getProjects();

        if (active) {
          setProjects(getProjectList(result));
        }
      } catch (error) {
        console.error("Dashboard projects error:", error);
        if (active) {
          setLoadError("Projects could not be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProjects();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const completed = projects.filter((project) =>
      ["completed", "complete", "done"].includes(getStatus(project))
    ).length;

    const teamProjects = projects.filter((project) => {
      const members =
        project?.members || project?.teamMembers || project?.team || [];
      return Array.isArray(members) && members.length > 1;
    }).length;

    const collaborators = new Set();

    projects.forEach((project) => {
      const members =
        project?.members || project?.teamMembers || project?.team || [];

      if (Array.isArray(members)) {
        members.forEach((member) => {
          const id =
            typeof member === "object"
              ? member?._id || member?.id || member?.email
              : member;
          if (id) collaborators.add(String(id));
        });
      }
    });

    return {
      total: projects.length,
      completed,
      teamProjects,
      collaborators: collaborators.size,
    };
  }, [projects]);

  const statusCounts = useMemo(() => {
    const counts = { completed: 0, active: 0, pending: 0 };

    projects.forEach((project) => {
      const status = getStatus(project);

      if (["completed", "complete", "done"].includes(status)) {
        counts.completed += 1;
      } else if (
        ["in progress", "in-progress", "active", "ongoing"].includes(status)
      ) {
        counts.active += 1;
      } else {
        counts.pending += 1;
      }
    });

    return counts;
  }, [projects]);

  const donutStyle = useMemo(() => {
    const total =
      statusCounts.completed + statusCounts.active + statusCounts.pending;

    if (!total) {
      return {
        background:
          "conic-gradient(#27334d 0deg 360deg)",
      };
    }

    const completedAngle = (statusCounts.completed / total) * 360;
    const activeAngle =
      completedAngle + (statusCounts.active / total) * 360;

    return {
      background: `conic-gradient(
        #8b5cf6 0deg ${completedAngle}deg,
        #36bffa ${completedAngle}deg ${activeAngle}deg,
        #f5b94c ${activeAngle}deg 360deg
      )`,
    };
  }, [statusCounts]);

  const weeklyActivity = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - i);

      const count = projects.filter((project) => {
        const created = new Date(
          project?.createdAt || project?.created_at || ""
        );

        return (
          !Number.isNaN(created.getTime()) &&
          created.getFullYear() === date.getFullYear() &&
          created.getMonth() === date.getMonth() &&
          created.getDate() === date.getDate()
        );
      }).length;

      days.push({
        label: date.toLocaleDateString("en-IN", { weekday: "short" }),
        count,
      });
    }

    return days;
  }, [projects]);

  const maxActivity = Math.max(...weeklyActivity.map((day) => day.count), 1);
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Garima";

  const recentProjects = [...projects]
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || a?.created_at || 0).getTime();
      const dateB = new Date(b?.createdAt || b?.created_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);

  const statusLabel = (status) => {
    if (["completed", "complete", "done"].includes(status)) return "Completed";
    if (["in progress", "in-progress", "active", "ongoing"].includes(status))
      return "In progress";
    return "Pending";
  };

  return (
    <div className="sb-dashboard">
      <section className="sb-welcome">
        <div className="sb-welcome-content">
          <span className="sb-eyebrow">
            <span className="sb-live-dot" />
            YOUR STUDENT WORKSPACE
          </span>

          <h1>
            Welcome back, <span>{displayName.split(" ")[0]}!</span>
          </h1>

          <p>
            Great things happen when you keep learning, building and
            collaborating. Let's make today count.
          </p>

          <div className="sb-welcome-actions">
            <Link to="/projects" className="sb-primary-btn">
              Explore projects <span>↗</span>
            </Link>
            <Link to="/profile" className="sb-secondary-btn">
              View profile
            </Link>
          </div>
        </div>

        <div className="sb-welcome-art" aria-hidden="true">
          <div className="sb-orbit sb-orbit-one" />
          <div className="sb-orbit sb-orbit-two" />
          <div className="sb-art-glow" />
          <div className="sb-art-symbol">✦</div>
          <div className="sb-art-card sb-art-card-top">✧ &nbsp; CREATE</div>
          <div className="sb-art-card sb-art-card-bottom">
            <span>●</span> KEEP BUILDING
          </div>
        </div>
      </section>

      <div className="sb-section-heading">
        <div>
          <span className="sb-eyebrow">YOUR OVERVIEW</span>
          <h2>Workspace overview</h2>
        </div>
        <span className="sb-updated-label">Live project data</span>
      </div>

      <section className="sb-stats-grid">
        <article className="sb-stat-card">
          <div className="sb-stat-top">
            <span className="sb-stat-icon purple">▣</span>
            <span className="sb-stat-caption">ALL PROJECTS</span>
          </div>
          <strong>{loading ? "—" : stats.total}</strong>
          <p>Total projects shared</p>
          <div className="sb-stat-bottom purple-text">Your project space</div>
        </article>

        <article className="sb-stat-card">
          <div className="sb-stat-top">
            <span className="sb-stat-icon blue">⌘</span>
            <span className="sb-stat-caption">TEAM PROJECTS</span>
          </div>
          <strong>{loading ? "—" : stats.teamProjects}</strong>
          <p>Projects with multiple members</p>
          <div className="sb-stat-bottom blue-text">Build together</div>
        </article>

        <article className="sb-stat-card">
          <div className="sb-stat-top">
            <span className="sb-stat-icon green">✓</span>
            <span className="sb-stat-caption">COMPLETED</span>
          </div>
          <strong>{loading ? "—" : stats.completed}</strong>
          <p>Completed projects</p>
          <div className="sb-stat-bottom green-text">Milestones achieved</div>
        </article>

        <article className="sb-stat-card">
          <div className="sb-stat-top">
            <span className="sb-stat-icon orange">♧</span>
            <span className="sb-stat-caption">COLLABORATORS</span>
          </div>
          <strong>{loading ? "—" : stats.collaborators}</strong>
          <p>Unique project members listed</p>
          <div className="sb-stat-bottom orange-text">Your network</div>
        </article>
      </section>

      <section className="sb-analytics-grid">
        <article className="sb-panel sb-project-analytics">
          <div className="sb-panel-heading">
            <div>
              <span className="sb-eyebrow">PROJECT BREAKDOWN</span>
              <h3>Project analytics</h3>
            </div>
            <span className="sb-panel-icon">◉</span>
          </div>

          <div className="sb-donut-layout">
            <div className="sb-donut" style={donutStyle}>
              <div className="sb-donut-hole">
                <strong>{loading ? "—" : stats.total}</strong>
                <span>PROJECTS</span>
              </div>
            </div>

            <div className="sb-legend">
              <div>
                <span className="sb-legend-dot completed-dot" />
                <span>Completed</span>
                <strong>{loading ? "—" : statusCounts.completed}</strong>
              </div>
              <div>
                <span className="sb-legend-dot active-dot" />
                <span>In progress</span>
                <strong>{loading ? "—" : statusCounts.active}</strong>
              </div>
              <div>
                <span className="sb-legend-dot pending-dot" />
                <span>Pending / other</span>
                <strong>{loading ? "—" : statusCounts.pending}</strong>
              </div>
            </div>
          </div>

          {!loading && projects.length === 0 && (
            <p className="sb-chart-note">
              Your project breakdown will appear here when projects are added.
            </p>
          )}
        </article>

        <article className="sb-panel sb-activity-panel">
          <div className="sb-panel-heading">
            <div>
              <span className="sb-eyebrow">LAST 7 DAYS</span>
              <h3>Weekly activity</h3>
            </div>
            <span className="sb-panel-icon">⌁</span>
          </div>

          <div className="sb-activity-summary">
            <strong>
              {loading
                ? "—"
                : weeklyActivity.reduce((sum, day) => sum + day.count, 0)}
            </strong>
            <span>projects created this week</span>
          </div>

          <div className="sb-bar-chart">
            {weeklyActivity.map((day) => (
              <div className="sb-bar-column" key={day.label}>
                <span className="sb-bar-value">{day.count || ""}</span>
                <div className="sb-bar-track">
                  <div
                    className="sb-bar-fill"
                    style={{
                      height: `${Math.max(
                        day.count ? (day.count / maxActivity) * 100 : 4,
                        4
                      )}%`,
                    }}
                  />
                </div>
                <span className="sb-bar-label">{day.label}</span>
              </div>
            ))}
          </div>

          <p className="sb-chart-note">
            Based on project creation dates available in your data.
          </p>
        </article>
      </section>

      <section className="sb-bottom-grid">
        <article className="sb-panel sb-recent-panel">
          <div className="sb-panel-heading">
            <div>
              <span className="sb-eyebrow">KEEP THE MOMENTUM</span>
              <h3>Recent projects</h3>
            </div>
            <Link to="/projects" className="sb-view-all">
              View all <span>↗</span>
            </Link>
          </div>

          {loading ? (
            <div className="sb-empty-state">Loading your projects...</div>
          ) : loadError ? (
            <div className="sb-empty-state sb-error-state">{loadError}</div>
          ) : recentProjects.length ? (
            <div className="sb-project-list">
              {recentProjects.map((project, index) => {
                const status = getStatus(project);
                return (
                  <div
                    className="sb-project-row"
                    key={project?._id || project?.id || index}
                  >
                    <div className={`sb-project-avatar avatar-${index + 1}`}>
                      {(project?.title || "P").charAt(0).toUpperCase()}
                    </div>

                    <div className="sb-project-info">
                      <strong>{project?.title || "Untitled project"}</strong>
                      <span>
                        {formatDate(project?.createdAt || project?.created_at)}
                      </span>
                    </div>

                    <span
                      className={`sb-status-badge ${
                        ["completed", "complete", "done"].includes(status)
                          ? "status-completed"
                          : ["in progress", "in-progress", "active", "ongoing"].includes(status)
                            ? "status-active"
                            : "status-pending"
                      }`}
                    >
                      {statusLabel(status)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="sb-empty-state">
              <span className="sb-empty-icon">✧</span>
              <strong>Your first project starts here</strong>
              <p>Share a project and it will appear in this section.</p>
              <Link to="/projects" className="sb-primary-btn">
                Explore projects <span>↗</span>
              </Link>
            </div>
          )}
        </article>

        <article className="sb-panel sb-quick-panel">
          <div className="sb-panel-heading">
            <div>
              <span className="sb-eyebrow">MAKE YOUR NEXT MOVE</span>
              <h3>Quick actions</h3>
            </div>
            <span className="sb-panel-icon">✦</span>
          </div>

          <Link to="/projects" className="sb-quick-link">
            <span className="sb-quick-icon purple">＋</span>
            <span>
              <strong>Explore projects</strong>
              <small>Discover ideas and opportunities</small>
            </span>
            <b>↗</b>
          </Link>

          <Link to="/explore" className="sb-quick-link">
            <span className="sb-quick-icon blue">⌕</span>
            <span>
              <strong>Find students</strong>
              <small>Connect with fellow learners</small>
            </span>
            <b>↗</b>
          </Link>

          <Link to="/profile" className="sb-quick-link">
            <span className="sb-quick-icon orange">◉</span>
            <span>
              <strong>Update your profile</strong>
              <small>Showcase your skills and work</small>
            </span>
            <b>↗</b>
          </Link>

          <div className="sb-quote-card">
            <span>✦ A LITTLE REMINDER</span>
            <p>Every great project begins with the courage to start.</p>
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
