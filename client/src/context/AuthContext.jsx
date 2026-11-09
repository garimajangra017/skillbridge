import {
createContext,
useCallback,
useEffect,
useState
} from "react";
import {
loginUser,
registerUser,
getCurrentUser,
logoutUser
} from "../services/authService.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
try {
return JSON.parse(localStorage.getItem("skillbridge_user")) || null;
} catch {
return null;
}
});

const [loading, setLoading] = useState(true);

const saveSession = useCallback((data) => {
if (data.token) {
localStorage.setItem("skillbridge_token", data.token);
}

```
if (data.user) {
  localStorage.setItem("skillbridge_user", JSON.stringify(data.user));
  setUser(data.user);
}

return data;
```

}, []);

useEffect(() => {
const token = localStorage.getItem("skillbridge_token");

```
if (!token) {
  setLoading(false);
  return;
}

getCurrentUser()
  .then((data) => {
    const currentUser = data.user || data;
    localStorage.setItem("skillbridge_user", JSON.stringify(currentUser));
    setUser(currentUser);
  })
  .catch(() => {
    logoutUser();
    setUser(null);
  })
  .finally(() => setLoading(false));
```

}, []);

const login = async (details) => saveSession(await loginUser(details));

const register = async (details) =>
saveSession(await registerUser(details));

const logout = () => {
logoutUser();
setUser(null);
};

const value = {
user,
loading,
isAuthenticated: Boolean(user && localStorage.getItem("skillbridge_token")),
login,
register,
logout,
setUser
};

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
};
