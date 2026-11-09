import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
const [theme, setTheme] = useState(
() => localStorage.getItem("skillbridge_theme") || "light"
);

useEffect(() => {
document.documentElement.dataset.theme = theme;
localStorage.setItem("skillbridge_theme", theme);
}, [theme]);

const toggleTheme = () => {
setTheme((current) => current === "light" ? "dark" : "light");
};

return (
<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
{children}
</ThemeContext.Provider>
);
};
