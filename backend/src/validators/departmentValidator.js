function validateDepartmentInput(data) {
  const errors = [];

  if (!data.departmentName || data.departmentName.trim() === "") {
    errors.push("Department name is required.");
  }

  if (!data.managerName || data.managerName.trim() === "") {
    errors.push("Manager name is required.");
  }

  if (data.departmentName && data.departmentName.trim().length < 2) {
    errors.push("Department name must be at least 2 characters.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateDepartmentInput
};