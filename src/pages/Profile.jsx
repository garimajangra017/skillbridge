import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { getMyProfile } from "../services/userService.js";
import { DEFAULT_AVATAR } from "../utils/constants.js";

const Profile = () => {
const { user, setUser } = useContext(AuthContext);
const [profile, setProfile] = useState(user);
const [error, setError] = useState("");

useEffect(() => {
getMyProfile()
.then((data) => {
const result = data.user || data;
setProfile(result);
setUser(result);
localStorage.setItem("skillbridge_user", JSON.stringify(result));
})
.catch((err) => setError(err.message));
}, [setUser]);

return ( <section className="page-section profile-page">
{error && <p role="alert">{error}</p>}
<img className="profile-avatar" src={profile?.avatar || DEFAULT_AVATAR} alt="Profile avatar" /> <h2>{profile?.name || "Student"}</h2> <p>{profile?.email}</p> <p>{profile?.bio || "Add a short introduction about yourself."}</p> <h3>Skills</h3> <div className="student-skills">
{(profile?.skills || []).map((skill) => ( <span className="skill-badge" key={skill}>{skill}</span>
))} </div>
{profile?.github && <p><a href={profile.github} target="_blank" rel="noreferrer">GitHub profile</a></p>}
{profile?.linkedin && <p><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn profile</a></p>} <Link to="/profile/edit">Edit profile</Link> </section>
);
};

export default Profile;
