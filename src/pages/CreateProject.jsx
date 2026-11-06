import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/projectService.js";

const CreateProject = () => {
const navigate = useNavigate();
const [form, setForm] = useState({
title: "",
description: "",
category: "Web Development",
techStack: "",
github: "",
liveDemo: ""
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
  await createProject({
    ...form,
    techStack: form.techStack.split(",").map((item) => item.trim()).filter(Boolean)
  });
  navigate("/projects");
} catch (err) {
  setError(err.message);
} finally {
  setSaving(false);
}
```

};

return ( <section className="page-section"> <h2>Create a project</h2> <form className="form-card" onSubmit={submit}> <label>Project title<input name="title" value={form.title} onChange={update} required /></label> <label>Description<textarea name="description" rows={5} value={form.description} onChange={update} required /></label> <label>Category <select name="category" value={form.category} onChange={update}> <option>Web Development</option> <option>Mobile App</option> <option>AI & Machine Learning</option> <option>Data Science</option> <option>Cybersecurity</option> <option>Other</option> </select> </label> <label>Technologies, separated by commas<input name="techStack" value={form.techStack} onChange={update} placeholder="React, Node.js, MongoDB" /></label> <label>GitHub URL<input name="github" type="url" value={form.github} onChange={update} /></label> <label>Live demo URL<input name="liveDemo" type="url" value={form.liveDemo} onChange={update} /></label>
{error && <p role="alert">{error}</p>} <button type="submit" disabled={saving}>{saving ? "Publishing..." : "Publish project"}</button> </form> </section>
);
};

export default CreateProject;
