function validateEmployeeInput(data) {
  const errors = [];

  if (!data.fullName || data.fullName.trim() === "") {
    errors.push("Full name is required.");
  }

  if (!data.employeeCode || data.employeeCode.trim() === "") {
    errors.push("Employee code is required.");
  }

  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required.");
  }

  if (data.email && !data.email.includes("@")) {
    errors.push("Email format is invalid.");
  }

  if (!data.position || data.position.trim() === "") {
    errors.push("Position is required.");
  }

  if (!data.departmentId || Number(data.departmentId) <= 0) {
    errors.push("Valid department is required.");
  }

  if (!data.hireDate || data.hireDate.trim() === "") {
    errors.push("Hire date is required.");
  }

  if (data.status && !["Active", "Inactive"].includes(data.status)) {
    errors.push("Status must be Active or Inactive.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateEmployeeInput
};