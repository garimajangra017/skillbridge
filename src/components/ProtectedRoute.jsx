import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const ProtectedRoute = () => {
const { isAuthenticated, loading } = useAuth();

if (loading) return <LoadingSpinner label="Checking your session..." />;

return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
