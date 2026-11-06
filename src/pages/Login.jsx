import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const Login = () => {
const { login } = useAuth();
const navigate = useNavigate();
const [form, setForm] = useState({ email: "", password: "" });
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const update = (event) =>
setForm({ ...form, [event.target.name]: event.target.value });

const submit = async (event) => {
event.preventDefault();
setError("");
setLoading(true);

```
try {
  await login(form);
  navigate("/dashboard");
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

};

return ( <section className="auth-card"> <h1>Welcome back</h1> <p>Log in to your SkillBridge account.</p> <form onSubmit={submit}> <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label> <label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
{error && <p role="alert" className="form-error">{error}</p>} <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button> </form> <p>New here? <Link to="/register">Create an account</Link></p> </section>
);
};

export default Login;
