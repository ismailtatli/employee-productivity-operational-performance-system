function validateLogin(data) {
  const errors = [];

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required.");
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateRegister(data) {
  const errors = [];

  if (!data.fullName || typeof data.fullName !== "string" || data.fullName.trim().length < 2) {
    errors.push("Full name is required and must be at least 2 characters.");
  }

  if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
    errors.push("Valid email is required.");
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.push("Password is required and must be at least 6 characters.");
  }

  const allowedRoles = [
    "Admin",
    "Manager",
    "Factory Manager",
    "Production",
    "Production Supervisor",
    "Quality",
    "Quality Control",
    "Quality Control Specialist",
    "HR",
    "Human Resources",
    "HR Specialist",
    "Viewer",
    "Department Viewer"
  ];

  const requestedRole = data.role || data.title || data.position;

  if (requestedRole && !allowedRoles.includes(requestedRole)) {
    errors.push("Invalid role.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateLogin,
  validateRegister
};