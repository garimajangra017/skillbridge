import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import useAuth from "../hooks/useAuth.js";

const Settings = () => {
const { theme, toggleTheme } = useContext(ThemeContext);
const { user, logout } = useAuth();

return ( <section className="page-section"> <h2>Settings</h2> <article className="settings-card"> <h3>Appearance</h3> <p>Current theme: {theme}</p> <button type="button" onClick={toggleTheme}>
Switch to {theme === "light" ? "dark" : "light"} theme </button> </article> <article className="settings-card"> <h3>Account</h3> <p>{user?.email}</p> <button type="button" onClick={logout}>Log out</button> </article> </section>
);
};

export default Settings;
