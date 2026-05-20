function validateMachineInput(data) {
  const errors = [];

  if (!data.machineCode || data.machineCode.trim() === "") {
    errors.push("Machine code is required.");
  }

  if (!data.machineName || data.machineName.trim() === "") {
    errors.push("Machine name is required.");
  }

  if (!data.departmentId || Number(data.departmentId) <= 0) {
    errors.push("Valid department is required.");
  }

  if (data.capacityPerShift === undefined || Number(data.capacityPerShift) <= 0) {
    errors.push("Capacity per shift must be greater than zero.");
  }

  if (data.status && !["Active", "Maintenance", "Inactive"].includes(data.status)) {
    errors.push("Status must be Active, Maintenance or Inactive.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateMachineInput
};