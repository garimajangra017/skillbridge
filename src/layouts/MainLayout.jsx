import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import Footer from "../components/Footer.jsx";

const titles = {
  "/dashboard": "Dashboard",
  "/explore": "Explore Students",
  "/projects": "Projects",
  "/messages": "Messages",
  "/notifications": "Notifications",
  "/profile": "My Profile",
  "/settings": "Settings",
  "/admin": "Admin Dashboard",
};

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-panel">
        <TopBar
          title={titles[location.pathname] || "SkillBridge"}
        />

        <main className="page-content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;