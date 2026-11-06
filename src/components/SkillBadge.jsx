const SkillBadge = ({ skill, onRemove }) => ( <span className="skill-badge">
{skill}
{onRemove && (
<button
type="button"
className="skill-badge-remove"
aria-label={`Remove ${skill}`}
onClick={() => onRemove(skill)}
>
× </button>
)} </span>
);

export default SkillBadge;
