import { useEffect, useState } from "react";
import StudentCard from "../components/StudentCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getStudents } from "../services/userService.js";

const Explore = () => {
const [students, setStudents] = useState([]);
const [search, setSearch] = useState("");
const [error, setError] = useState("");

useEffect(() => {
getStudents()
.then((data) => setStudents(Array.isArray(data) ? data : data.users || []))
.catch((err) => setError(err.message));
}, []);

const filtered = students.filter((student) =>
`${student.name} ${student.bio} ${(student.skills || []).join(" ")}`
.toLowerCase()
.includes(search.toLowerCase())
);

return ( <section className="page-section"> <h2>Explore students</h2> <p>Find collaborators with skills that complement yours.</p> <SearchBar value={search} onChange={setSearch} placeholder="Search names and skills..." />
{error && <p role="alert">{error}</p>} <div className="student-grid">
{filtered.map((student) => <StudentCard key={student._id} student={student} />)} </div>
{!filtered.length && !error && <EmptyState title="No students found" description="Try another search." />} </section>
);
};

export default Explore;
