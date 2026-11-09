
import { useEffect, useState } from "react";
import Messages from "./pages/Messages.jsx";
import "./App.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const demoProjects = [
  {
    _id: "demo1",
    title: "Student Collaboration Platform",
    description: "A platform where students can connect, share skills and build projects together.",
    category: "Web Development",
    techStack: ["React", "Node.js", "MongoDB"],
    owner: { name: "Aarav Sharma" },
    likes: [],
  },
  {
    _id: "demo2",
    title: "Smart Study Planner",
    description: "Organize assignments, manage study sessions and track learning goals.",
    category: "Productivity",
    techStack: ["React", "CSS", "JavaScript"],
    owner: { name: "Priya Verma" },
    likes: [],
  },
  {
    _id: "demo3",
    title: "Campus Connect",
    description: "A student community for events, discussions and campus updates.",
    category: "Community",
    techStack: ["JavaScript", "Express", "MongoDB"],
    owner: { name: "Rohan Mehta" },
    likes: [],
  },
];

const demoStudents = [
  {
    _id: "student1",
    name: "Aarav Sharma",
    skills: ["React", "JavaScript", "UI Design"],
    bio: "Frontend developer who enjoys building useful products.",
  },
  {
    _id: "student2",
    name: "Priya Verma",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    bio: "Curious learner interested in AI and data science.",
  },
  {
    _id: "student3",
    name: "Rohan Mehta",
    skills: ["Node.js", "MongoDB", "Express"],
    bio: "Backend developer who loves solving problems.",
  },
  {
    _id: "student4",
    name: "Ananya Singh",
    skills: ["Figma", "CSS", "UX Design"],
    bio: "Designer focused on simple and accessible experiences.",
  },
];

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("skillbridge_user") || "null");
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem("skillbridge_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Something went wrong."
    );
  }

  return data;
}

function getUserName(user) {
  return user?.name || user?.fullName || user?.username || "Student";
}

function getProjectOwner(project) {
  if (typeof project?.owner === "string") return project.owner;

  return (
    project?.owner?.name ||
    project?.user?.name ||
    project?.createdBy?.name ||
    "SkillBridge Student"
  );
}

function App() {
  const [user, setUser] = useState(readSavedUser);
  const [page, setPage] = useState(
    readSavedUser() ? "Dashboard" : "Home"
  );
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [projects, setProjects] = useState(demoProjects);
  const [students, setStudents] = useState(demoStudents);

  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: "",
    college: "",
    github: "",
    linkedin: "",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    techStack: "",
  });

  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || user.fullName || "",
      bio: user.bio || "",
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : user.skills || "",
      college: user.college || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
    });

    loadProjects();
    loadStudents();
  }, [user]);

  async function loadProjects() {
    try {
      const data = await request("/projects");
      const list = Array.isArray(data)
        ? data
        : data.projects || data.data || [];

      if (list.length) setProjects(list);
    } catch {
      setProjects(demoProjects);
    }
  }

  async function loadStudents() {
    try {
      const data = await request("/profile/students");
      const list = Array.isArray(data)
        ? data
        : data.students || data.data || [];

      if (list.length) setStudents(list);
    } catch {
      setStudents(demoStudents);
    }
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function navigate(nextPage) {
    setPage(nextPage);
    setSearch("");
    setSelectedProject(null);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const endpoint =
        authMode === "login" ? "/auth/login" : "/auth/register";

      const payload =
        authMode === "login"
          ? {
              email: authForm.email,
              password: authForm.password,
            }
          : authForm;

      const data = await request(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const token = data.token || data.accessToken;
      const nextUser = data.user || data.data?.user || data.data;

      if (!nextUser || !token) {
        showNotice("Server response is missing the user or token.");
        return;
      }

      localStorage.setItem("skillbridge_token", token);
      localStorage.setItem("skillbridge_user", JSON.stringify(nextUser));

      setUser(nextUser);
      setPage("Dashboard");
      showNotice(
        authMode === "login"
          ? "Welcome back!"
          : "Account created successfully!"
      );
    } catch (error) {
      showNotice(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem("skillbridge_token");
    localStorage.removeItem("skillbridge_user");

    setUser(null);
    setPage("Home");
    setSelectedProject(null);

    showNotice("You have been logged out.");
  }

  async function createProject(event) {
    event.preventDefault();

    if (
      !projectForm.title.trim() ||
      !projectForm.description.trim()
    ) {
      showNotice("Please enter a project title and description.");
      return;
    }

    setBusy(true);

    const payload = {
      ...projectForm,
      techStack: projectForm.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const data = await request("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const newProject = data.project || data.data || data;

      setProjects((current) => [newProject, ...current]);

      setProjectForm({
        title: "",
        description: "",
        category: "Web Development",
        techStack: "",
      });

      setPage("Projects");
      showNotice("Your project has been created!");
    } catch (error) {
      showNotice(
        error.message || "Could not create project."
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);

    const payload = {
      ...profile,
      skills: profile.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const data = await request("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const updatedUser =
        data.user || data.data || { ...user, ...payload };

      const mergedUser = {
        ...user,
        ...updatedUser,
        ...payload,
      };

      localStorage.setItem(
        "skillbridge_user",
        JSON.stringify(mergedUser)
      );

      setUser(mergedUser);
      showNotice("Profile saved successfully!");
    } catch (error) {
      showNotice(
        error.message || "Could not save your profile."
      );
    } finally {
      setBusy(false);
    }
  }

  async function likeProject(project) {
    try {
      const data = await request(
        `/projects/${project._id}/like`,
        { method: "POST" }
      );

      if (data.project) {
        setProjects((current) =>
          current.map((item) =>
            item._id === project._id ? data.project : item
          )
        );
      } else {
        setProjects((current) =>
          current.map((item) =>
            item._id === project._id
              ? {
                  ...item,
                  likes: [...(item.likes || []), user?._id || "me"],
                }
              : item
          )
        );
      }
    } catch {
      setProjects((current) =>
        current.map((item) =>
          item._id === project._id
            ? {
                ...item,
                likes: [...(item.likes || []), user?._id || "me"],
              }
            : item
        )
      );

      showNotice("Demo like updated; it may not be saved on the server.");
    }
  }

  const filteredProjects = projects.filter((project) => {
    const stack = Array.isArray(project.techStack)
      ? project.techStack.join(" ")
      : "";

    const content =
      `${project.title || ""} ${project.description || ""} ` +
      `${project.category || ""} ${stack}`;

    return content.toLowerCase().includes(search.toLowerCase());
  });

  const filteredStudents = students.filter((student) => {
    const skills = Array.isArray(student.skills)
      ? student.skills.join(" ")
      : student.skills || "";

    const content =
      `${getUserName(student)} ${student.bio || ""} ${skills}`;

    return content.toLowerCase().includes(search.toLowerCase());
  });
    // Project category data for the donut chart
  const categoryCounts = projects.reduce((counts, project) => {
    const category = project.category || "Other";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const categoryChartData = Object.entries(categoryCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const chartColors = [
    "#9275F5",
    "#42D6B0",
    "#FFAE80",
    "#5CA9FF",
    "#F477B8",
    "#E6C66A",
  ];

  // Count projects created on each of the last seven days
  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = projects.filter((project) => {
      if (!project.createdAt) return false;

      const createdDate = new Date(project.createdAt);

      return (
        !Number.isNaN(createdDate.getTime()) &&
        createdDate >= date &&
        createdDate < nextDate
      );
    }).length;

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      projects: count,
    };
  });

  const hasWeeklyActivity = weeklyActivity.some(
    (item) => item.projects > 0
  );

  const navItems = [
    { name: "Dashboard", icon: "◫" },
    { name: "Explore", icon: "⌕" },
    { name: "Projects", icon: "▧" },
    { name: "Messages", icon: "✉" },
    { name: "My Profile", icon: "◎" },
  ];

  function ProjectCard({ project }) {
    const stack = Array.isArray(project.techStack)
      ? project.techStack
      : [];

    const likeCount = Array.isArray(project.likes)
      ? project.likes.length
      : 0;

    return (
      <article className="project-card">
        <div className="project-card-top">
          <span className="project-icon">✳</span>
          <span className="category-pill">
            {project.category || "Student Project"}
          </span>
        </div>

        <h3>{project.title}</h3>
        <p>{project.description || "No description added yet."}</p>

        <div className="tech-list">
          {stack.length ? (
            stack.map((tech, index) => (
              <span key={`${tech}-${index}`}>{tech}</span>
            ))
          ) : (
            <span>New idea</span>
          )}
        </div>

        <div className="project-card-bottom">
          <span className="owner-name">
            <span className="mini-avatar">
              {getProjectOwner(project).charAt(0).toUpperCase()}
            </span>
            {getProjectOwner(project)}
          </span>

          <div className="project-actions">
            <button
              className="icon-button"
              onClick={() => likeProject(project)}
              aria-label="Like project"
            >
              ♡ <span>{likeCount}</span>
            </button>

            <button
              className="text-button"
              onClick={() => setSelectedProject(project)}
            >
              View details ↗
            </button>
          </div>
        </div>
      </article>
    );
  }

  function StudentCard({ student }) {
    const skills = Array.isArray(student.skills)
      ? student.skills
      : typeof student.skills === "string"
        ? student.skills.split(",").map((item) => item.trim()).filter(Boolean)
        : [];

    return (
      <article className="student-card">
        <div className="student-avatar">
          {getUserName(student).charAt(0).toUpperCase()}
        </div>

        <h3>{getUserName(student)}</h3>
        <p>{student.bio || "A student ready to learn and collaborate."}</p>

        <div className="tech-list">
          {skills.length ? (
            skills.slice(0, 4).map((skill, index) => (
              <span key={`${skill}-${index}`}>{skill}</span>
            ))
          ) : (
            <span>Skills not added</span>
          )}
        </div>

        <button
          className="outline-button full-button"
          onClick={() => navigate("Messages")}
        >
          Connect with student ↗
        </button>
      </article>
    );
  }

  return (
    <div className="app-shell">
      {notice && <div className="toast-message">{notice}</div>}

      {!user ? (
        <div className="auth-layout">
          <section className="auth-showcase">
            <button
              className="brand brand-light"
              onClick={() => setPage("Home")}
            >
              <span className="brand-mark">S</span> SkillBridge
            </button>

            <div className="showcase-content">
              <span className="eyebrow light-eyebrow">
                YOUR SKILLS. YOUR FUTURE.
              </span>

              <h1>
                Build together.
                <br />
                <span>Grow together.</span>
              </h1>

              <p>
                Meet students, share your skills and turn your ideas into
                real projects.
              </p>

              <div className="showcase-stats">
                <div><strong>01</strong><span>Discover skills</span></div>
                <div><strong>02</strong><span>Find your team</span></div>
                <div><strong>03</strong><span>Build something</span></div>
              </div>
            </div>

            <div className="showcase-footer">
              A community for curious minds.
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-card">
              <span className="eyebrow">
                {authMode === "login" ? "WELCOME BACK" : "START YOUR JOURNEY"}
              </span>

              <h2>
                {authMode === "login"
                  ? "Sign in to SkillBridge"
                  : "Create your account"}
              </h2>

              <p className="muted">
                {authMode === "login"
                  ? "Pick up where your next big idea begins."
                  : "Join students who love learning and building."}
              </p>

              <form onSubmit={handleAuth} className="form-stack">
                {authMode === "register" && (
                  <label>
                    Full name
                    <input
                      required
                      value={authForm.name}
                      onChange={(event) =>
                        setAuthForm({ ...authForm, name: event.target.value })
                      }
                      placeholder="Enter your name"
                    />
                  </label>
                )}

                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={authForm.email}
                    onChange={(event) =>
                      setAuthForm({ ...authForm, email: event.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Password
                  <input
                    required
                    minLength={6}
                    type="password"
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm({
                        ...authForm,
                        password: event.target.value,
                      })
                    }
                    placeholder="At least 6 characters"
                  />
                </label>

                <button className="primary-button full-button" disabled={busy}>
                  {busy
                    ? "Please wait..."
                    : authMode === "login"
                      ? "Sign in →"
                      : "Create account →"}
                </button>
              </form>

              <p className="auth-switch">
                {authMode === "login"
                  ? "New to SkillBridge?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "register" : "login")
                  }
                >
                  {authMode === "login" ? "Create an account" : "Sign in"}
                </button>
              </p>

              <button className="back-home" onClick={() => setPage("Home")}>
                ← Back to home
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="dashboard-layout">
          <aside className="sidebar">
            <button className="brand" onClick={() => navigate("Dashboard")}>
              <span className="brand-mark">S</span>
              <span>SkillBridge</span>
            </button>

            <div className="sidebar-label">WORKSPACE</div>

            <nav className="side-nav">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`nav-item ${page === item.name ? "active" : ""}`}
                  onClick={() => navigate(item.name)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.name}
                  {item.name === "Messages" && <span className="nav-dot" />}
                </button>
              ))}
            </nav>

            <div className="sidebar-bottom">
              <div className="sidebar-tip">
                <span>✦</span>
                <strong>Small steps, big things.</strong>
                <p>Your next collaboration could start today.</p>
              </div>

              <button
                className="user-mini"
                onClick={() => navigate("My Profile")}
              >
                <span className="user-avatar">
                  {getUserName(user).charAt(0).toUpperCase()}
                </span>
                <span className="user-mini-info">
                  <strong>{getUserName(user)}</strong>
                  <small>Student account</small>
                </span>
                <span className="more-icon">···</span>
              </button>

              <button className="logout-button" onClick={logout}>
                ↪ Sign out
              </button>
            </div>
          </aside>

          <main className="main-panel">
            <header className="topbar">
              <div className="breadcrumb">
                Workspace <span>/</span> <strong>{page}</strong>
              </div>

              <div className="topbar-right">
                <span className="status-indicator" />
                <span className="online-label">Your workspace</span>
                <button
                  className="top-avatar"
                  onClick={() => navigate("My Profile")}
                >
                  {getUserName(user).charAt(0).toUpperCase()}
                </button>
              </div>
            </header>

            <div className="page-content">
              {page === "Dashboard" && (
                <>
                  <div className="welcome-row">
                    <div>
                      <span className="eyebrow">YOUR STUDENT WORKSPACE</span>
                      <h1>
                        Hey, {getUserName(user).split(" ")[0]}{" "}
                        <span className="wave">✦</span>
                      </h1>
                      <p className="muted">
                        Ready to learn something new and build something great?
                      </p>
                    </div>

                    <button
                      className="primary-button"
                      onClick={() => navigate("Create Project")}
                    >
                      ＋ New project
                    </button>
                  </div>

                  <section className="hero-banner">
                    <div className="hero-copy">
                      <span className="hero-tag">
                        YOUR NEXT CHAPTER STARTS HERE
                      </span>
                      <h2>
                        Good ideas get better
                        <br />
                        when we <span>build together.</span>
                      </h2>
                      <p>
                        Find your people. Share what you know. Make something
                        meaningful.
                      </p>
                      <button
                        className="hero-button"
                        onClick={() => navigate("Explore")}
                      >
                        Explore the community ↗
                      </button>
                    </div>

                    <div className="hero-art">
                      <div className="orbit orbit-one" />
                      <div className="orbit orbit-two" />
                      <div className="art-center">S</div>
                      <div className="float-chip chip-one">✦ Create</div>
                      <div className="float-chip chip-two">⌘ Collaborate</div>
                      <div className="float-chip chip-three">↗ Grow</div>
                    </div>
                  </section>

                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">WHAT'S HAPPENING</span>
                      <h2>Your overview</h2>
                    </div>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-symbol purple">▧</span>
                      <span className="stat-label">Community projects</span>
                      <strong>{projects.length}</strong>
                      <small>Ideas shared by students</small>
                    </div>

                    <div className="stat-card">
                      <span className="stat-symbol mint">◎</span>
                      <span className="stat-label">Students to discover</span>
                      <strong>{students.length}</strong>
                      <small>Potential teammates</small>
                    </div>

                    <div className="stat-card">
                      <span className="stat-symbol peach">✧</span>
                      <span className="stat-label">Your profile</span>
                      <strong>
                        {profile.skills
                          ? profile.skills.split(",").filter(Boolean).length
                          : 0}
                      </strong>
                      <small>Skills added to your profile</small>
                    </div>
                  </div>
                                    {/* ANALYTICS CHARTS */}
                  <section className="analytics-grid">
                    <article className="chart-card">
                      <div className="chart-heading">
                        <div>
                          <span className="eyebrow">PROJECT INSIGHTS</span>
                          <h2>Projects by category</h2>
                          <p>Explore the community's project mix.</p>
                        </div>
                        <span className="chart-icon">◉</span>
                      </div>

                      {categoryChartData.length > 0 ? (
                        <>
                          <div className="donut-chart-wrap">
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={categoryChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="48%"
                                  innerRadius={65}
                                  outerRadius={95}
                                  paddingAngle={5}
                                  stroke="none"
                                >
                                  {categoryChartData.map((entry, index) => (
                                    <Cell
                                      key={entry.name}
                                      fill={chartColors[index % chartColors.length]}
                                    />
                                  ))}
                                </Pie>

                                <Tooltip
                                  contentStyle={{
                                    background: "#111d33",
                                    border: "1px solid #35425c",
                                    borderRadius: "12px",
                                    color: "#ffffff",
                                  }}
                                />

                                <Legend
                                  verticalAlign="bottom"
                                  iconType="circle"
                                  wrapperStyle={{
                                    color: "#aab7ce",
                                    fontSize: "12px",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="chart-total">
                            <strong>{projects.length}</strong>
                            <span>Total projects</span>
                          </div>
                        </>
                      ) : (
                        <div className="chart-empty">
                          No project data available yet.
                        </div>
                      )}
                    </article>

                    <article className="chart-card">
                      <div className="chart-heading">
                        <div>
                          <span className="eyebrow">LAST 7 DAYS</span>
                          <h2>Weekly activity</h2>
                          <p>Projects created during the week.</p>
                        </div>
                        <span className="chart-icon">↗</span>
                      </div>

                      <div className="activity-chart">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart
                            data={weeklyActivity}
                            margin={{
                              top: 15,
                              right: 8,
                              left: -18,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid
                              stroke="#263650"
                              strokeDasharray="4 5"
                              vertical={false}
                            />

                            <XAxis
                              dataKey="day"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#93a3bd", fontSize: 12 }}
                            />

                            <YAxis
                              allowDecimals={false}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#93a3bd", fontSize: 12 }}
                            />

                            <Tooltip
                              cursor={{ fill: "rgba(146,117,245,0.08)" }}
                              contentStyle={{
                                background: "#111d33",
                                border: "1px solid #35425c",
                                borderRadius: "12px",
                                color: "#ffffff",
                              }}
                            />

                            <Bar
                              dataKey="projects"
                              name="Projects created"
                              fill="#9275F5"
                              radius={[7, 7, 0, 0]}
                              maxBarSize={35}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {!hasWeeklyActivity && (
                        <p className="chart-note">
                          No projects with creation dates recorded this week yet.
                        </p>
                      )}
                    </article>
                  </section>

                  <div className="section-heading section-heading-spaced">
                    <div>
                      <span className="eyebrow">MADE BY THE COMMUNITY</span>
                      <h2>Projects to explore</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("Projects")}
                    >
                      View all projects ↗
                    </button>
                  </div>

                  <div className="project-grid">
                    {projects.slice(0, 3).map((project) => (
                      <ProjectCard
                        key={project._id || project.title}
                        project={project}
                      />
                    ))}
                  </div>
                </>
              )}

              {page === "Explore" && (
                <>
                  <div className="page-heading">
                    <span className="eyebrow">MEET YOUR PEOPLE</span>
                    <h1>Explore students</h1>
                    <p className="muted">
                      Find people with skills, ideas and interests that match yours.
                    </p>
                  </div>

                  <div className="search-bar">
                    <span>⌕</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search students or skills..."
                    />
                  </div>

                  <div className="student-grid">
                    {filteredStudents.map((student) => (
                      <StudentCard
                        key={student._id || student.name}
                        student={student}
                      />
                    ))}
                  </div>

                  {filteredStudents.length === 0 && (
                    <div className="empty-state">
                      <span>⌕</span>
                      <h3>No students found</h3>
                      <p>Try a different name or skill.</p>
                    </div>
                  )}
                </>
              )}

              {page === "Projects" && (
                <>
                  <div className="page-heading heading-with-action">
                    <div>
                      <span className="eyebrow">IDEAS IN MOTION</span>
                      <h1>Community projects</h1>
                      <p className="muted">
                        Discover what students are building and find an idea to join.
                      </p>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => navigate("Create Project")}
                    >
                      ＋ Share a project
                    </button>
                  </div>

                  <div className="search-bar">
                    <span>⌕</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search projects, categories or tech..."
                    />
                  </div>

                  <div className="project-grid">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project._id || project.title}
                        project={project}
                      />
                    ))}
                  </div>

                  {filteredProjects.length === 0 && (
                    <div className="empty-state">
                      <span>▧</span>
                      <h3>No projects found</h3>
                      <p>Try another search or create a new project.</p>
                    </div>
                  )}
                </>
              )}

              {page === "Create Project" && (
                <div className="form-page">
                  <div className="page-heading">
                    <span className="eyebrow">SHARE YOUR IDEA</span>
                    <h1>Create a project</h1>
                    <p className="muted">
                      Give your idea a home and invite others to build with you.
                    </p>
                  </div>

                  <form className="content-form" onSubmit={createProject}>
                    <label>
                      Project title
                      <input
                        required
                        value={projectForm.title}
                        onChange={(event) =>
                          setProjectForm({
                            ...projectForm,
                            title: event.target.value,
                          })
                        }
                        placeholder="e.g. Campus Event Planner"
                      />
                    </label>

                    <label>
                      Short description
                      <textarea
                        required
                        rows="4"
                        value={projectForm.description}
                        onChange={(event) =>
                          setProjectForm({
                            ...projectForm,
                            description: event.target.value,
                          })
                        }
                        placeholder="What are you building?"
                      />
                    </label>

                    <label>
                      Category
                      <select
                        value={projectForm.category}
                        onChange={(event) =>
                          setProjectForm({
                            ...projectForm,
                            category: event.target.value,
                          })
                        }
                      >
                        <option>Web Development</option>
                        <option>Mobile App</option>
                        <option>Artificial Intelligence</option>
                        <option>Data Science</option>
                        <option>UI/UX Design</option>
                        <option>Productivity</option>
                        <option>Community</option>
                        <option>Other</option>
                      </select>
                    </label>

                    <label>
                      Technologies
                      <input
                        value={projectForm.techStack}
                        onChange={(event) =>
                          setProjectForm({
                            ...projectForm,
                            techStack: event.target.value,
                          })
                        }
                        placeholder="React, Node.js, MongoDB"
                      />
                      <small>Separate technologies with commas.</small>
                    </label>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="outline-button"
                        onClick={() => navigate("Projects")}
                      >
                        Cancel
                      </button>
                      <button className="primary-button" disabled={busy}>
                        {busy ? "Publishing..." : "Publish project →"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {page === "My Profile" && (
                <div className="form-page">
                  <div className="page-heading">
                    <span className="eyebrow">YOUR STORY</span>
                    <h1>My profile</h1>
                    <p className="muted">
                      Tell the community what you are learning and what you love to build.
                    </p>
                  </div>

                  <div className="profile-intro">
                    <div className="profile-avatar">
                      {getUserName(user).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2>{getUserName(user)}</h2>
                      <p>{user.email || "Student member"}</p>
                    </div>
                  </div>

                  <form className="content-form" onSubmit={saveProfile}>
                    <label>
                      Full name
                      <input
                        required
                        value={profile.name}
                        onChange={(event) =>
                          setProfile({ ...profile, name: event.target.value })
                        }
                      />
                    </label>

                    <label>
                      About you
                      <textarea
                        rows="4"
                        value={profile.bio}
                        onChange={(event) =>
                          setProfile({ ...profile, bio: event.target.value })
                        }
                        placeholder="Tell others a little about yourself..."
                      />
                    </label>

                    <label>
                      Skills
                      <input
                        value={profile.skills}
                        onChange={(event) =>
                          setProfile({ ...profile, skills: event.target.value })
                        }
                        placeholder="React, Python, UI Design"
                      />
                      <small>Separate skills with commas.</small>
                    </label>

                    <label>
                      College or university
                      <input
                        value={profile.college}
                        onChange={(event) =>
                          setProfile({ ...profile, college: event.target.value })
                        }
                        placeholder="Your college name"
                      />
                    </label>

                    <label>
                      GitHub profile
                      <input
                        value={profile.github}
                        onChange={(event) =>
                          setProfile({ ...profile, github: event.target.value })
                        }
                        placeholder="https://github.com/username"
                      />
                    </label>

                    <label>
                      LinkedIn profile
                      <input
                        value={profile.linkedin}
                        onChange={(event) =>
                          setProfile({ ...profile, linkedin: event.target.value })
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                    </label>

                    <button className="primary-button" disabled={busy}>
                      {busy ? "Saving..." : "Save profile →"}
                    </button>
                  </form>
                </div>
              )}

              {page === "Messages" && <Messages />}

              {page === "Home" && (
                <div className="page-heading">
                  <span className="eyebrow">WELCOME TO SKILLBRIDGE</span>
                  <h1>Learn. Build. Connect.</h1>
                  <p className="muted">
                    Your student community for discovering skills and building projects together.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => navigate("Dashboard")}
                  >
                    Open dashboard →
                  </button>
                </div>
              )}
            </div>

            <footer className="main-footer">
              <span>SkillBridge</span>
              <span>Learn together. Build together.</span>
            </footer>
          </main>
        </div>
      )}

      {selectedProject && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <section
            className="project-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>

            <span className="category-pill">
              {selectedProject.category || "Student Project"}
            </span>

            <h2>{selectedProject.title}</h2>
            <p>
              {selectedProject.description || "No description has been added yet."}
            </p>

            <div className="modal-meta">
              <strong>Created by</strong>
              <span>{getProjectOwner(selectedProject)}</span>
            </div>

            <div className="modal-meta">
              <strong>Technologies</strong>
              <span>
                {Array.isArray(selectedProject.techStack) &&
                selectedProject.techStack.length
                  ? selectedProject.techStack.join(", ")
                  : "Not specified"}
              </span>
            </div>

            <button
              className="primary-button full-button"
              onClick={() => {
                setSelectedProject(null);
                setPage("Messages");
              }}
            >
              Connect about this project ↗
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
