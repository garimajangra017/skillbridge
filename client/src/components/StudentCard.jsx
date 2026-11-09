import { DEFAULT_AVATAR } from "../utils/constants.js";

const StudentCard = ({ student, onViewProfile }) => (

  <article className="student-card">
    <img
      className="student-avatar"
      src={student.avatar || DEFAULT_AVATAR}
      alt={`${student.name || "Student"} avatar`}
    />
    <h3>{student.name || "Student"}</h3>
    <p>{student.bio || "SkillBridge community member"}</p>
    <div className="student-skills">
      {(student.skills || []).slice(0, 4).map((skill) => (
        <span className="skill-badge" key={skill}>{skill}</span>
      ))}
    </div>
    {onViewProfile && (
      <button type="button" onClick={() => onViewProfile(student)}>
        View profile
      </button>
    )}
  </article>
);

export default StudentCard;
