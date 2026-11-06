import {
createContext,
useCallback,
useContext,
useEffect,
useState
} from "react";
import { AuthContext } from "./AuthContext.jsx";
import { getNotifications } from "../services/notificationService.js";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
const { user } = useContext(AuthContext);
const [notifications, setNotifications] = useState([]);

const refreshNotifications = useCallback(async () => {
if (!user) {
setNotifications([]);
return;
}

```
try {
  const data = await getNotifications();
  setNotifications(Array.isArray(data) ? data : data.notifications || []);
} catch {
  setNotifications([]);
}
```

}, [user]);

useEffect(() => {
refreshNotifications();
}, [refreshNotifications]);

const unreadCount = notifications.filter((item) => !item.read).length;

return (
<NotificationContext.Provider
value={{ notifications, setNotifications, unreadCount, refreshNotifications }}
>
{children}
</NotificationContext.Provider>
);
};
