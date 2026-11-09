import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const Register = () => {
const { register } = useAuth();
const navigate = useNavigate();
const [form, setForm] = useState({ name: "", email: "", password: "" });
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const update = (event) =>
setForm({ ...form, [event.target.name]: event.target.value });

const submit = async (event) => {
event.preventDefault();
setError("");

```
if (form.password.length < 6) {
  setError("Password must contain at least 6 characters");
  return;
}

setLoading(true);

try {
  await register(form);
  navigate("/dashboard");
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

};

return ( <section className="auth-card"> <h1>Create your account</h1> <p>Join the SkillBridge student community.</p> <form onSubmit={submit}> <label>Full name<input name="name" value={form.name} onChange={update} required /></label> <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label> <label>Password<input name="password" type="password" minLength={6} value={form.password} onChange={update} required /></label>
{error && <p role="alert" className="form-error">{error}</p>} <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button> </form> <p>Already registered? <Link to="/login">Log in</Link></p> </section>
);
};

export default Register;
