function validateLoginInput(data) {
  const errors = [];

  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required.");
  }

  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required.");
  }

  if (data.email && !data.email.includes("@")) {
    errors.push("Email format is invalid.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateLoginInput
};