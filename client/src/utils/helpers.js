export const formatDate = (date) => {
if (!date) return "";

return new Intl.DateTimeFormat("en-IN", {
day: "numeric",
month: "short",
year: "numeric"
}).format(new Date(date));
};

export const getInitials = (name = "Student") =>
name
.trim()
.split(/\s+/)
.slice(0, 2)
.map((part) => part[0]?.toUpperCase() || "")
.join("");

export const normalizeSkills = (skills) => {
if (Array.isArray(skills)) return skills;

if (typeof skills === "string") {
return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
}

return [];
};

export const isValidUrl = (value) => {
if (!value) return true;

try {
const url = new URL(value);
return url.protocol === "https:" || url.protocol === "http:";
} catch {
return false;
}
};
