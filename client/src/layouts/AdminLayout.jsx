import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";

const AdminLayout = () => {
const { user, loading, isAuthenticated } = useAuth();

if (loading) return <LoadingSpinner />;
if (!isAuthenticated) return <Navigate to="/login" replace />;
if (user?.role !== "Admin") return <Navigate to="/dashboard" replace />;

return ( <div className="app-shell"> <Sidebar /> <div className="app-main"> <TopBar title="Admin Dashboard" /> <main className="app-content"> <Outlet /> </main> </div> </div>
);
};

export default AdminLayout;
