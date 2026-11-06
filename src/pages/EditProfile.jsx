import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { updateMyProfile } from "../services/userService.js";

const EditProfile = () => {
const { user, setUser } = useContext(AuthContext);
const navigate = useNavigate();
const [form, setForm] = useState({
name: user?.name || "",
bio: user?.bio || "",
skills: (user?.skills || []).join(", "),
avatar: user?.avatar || "",
github: user?.github || "",
linkedin: user?.linkedin || ""
});
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);

const update = (event) =>
setForm({ ...form, [event.target.name]: event.target.value });

const submit = async (event) => {
event.preventDefault();
setError("");
setSaving(true);

```
try {
  const data = await updateMyProfile({
    ...form,
    skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean)
  });
  const updatedUser = data.user || data;
  setUser(updatedUser);
  localStorage.setItem("skillbridge_user", JSON.stringify(updatedUser));
  navigate("/profile");
} catch (err) {
  setError(err.message);
} finally {
  setSaving(false);
}
```

};

return ( <section className="page-section"> <h2>Edit profile</h2> <form className="form-card" onSubmit={submit}> <label>Name<input name="name" value={form.name} onChange={update} required /></label> <label>Bio<textarea name="bio" value={form.bio} onChange={update} rows={4} /></label> <label>Skills, separated by commas<input name="skills" value={form.skills} onChange={update} /></label> <label>Avatar URL<input name="avatar" type="url" value={form.avatar} onChange={update} /></label> <label>GitHub URL<input name="github" type="url" value={form.github} onChange={update} /></label> <label>LinkedIn URL<input name="linkedin" type="url" value={form.linkedin} onChange={update} /></label>
{error && <p role="alert">{error}</p>} <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button> </form> </section>
);
};

export default EditProfile;
