function validateProductionRecordInput(data) {
  const errors = [];

  if (!data.employeeId || Number(data.employeeId) <= 0) {
    errors.push("Valid employee is required.");
  }

  if (!data.productId || Number(data.productId) <= 0) {
  errors.push("Valid product is required.");
}

if (!data.machineId || Number(data.machineId) <= 0) {
  errors.push("Valid production machine is required.");
}

  if (!data.recordDate || data.recordDate.trim() === "") {
    errors.push("Record date is required.");
  }

  if (!data.period || data.period.trim() === "") {
    errors.push("Period is required.");
  }

  if (!data.productType || data.productType.trim() === "") {
    errors.push("Product type is required.");
  }

  if (data.targetQuantity === undefined || Number(data.targetQuantity) <= 0) {
    errors.push("Target quantity must be greater than zero.");
  }

  if (data.actualQuantity === undefined || Number(data.actualQuantity) <= 0) {
    errors.push("Actual quantity must be greater than zero.");
  }

  if (data.defectiveQuantity === undefined || Number(data.defectiveQuantity) < 0) {
    errors.push("Defective quantity cannot be negative.");
  }

  if (
    data.actualQuantity !== undefined &&
    data.defectiveQuantity !== undefined &&
    Number(data.defectiveQuantity) > Number(data.actualQuantity)
  ) {
    errors.push("Defective quantity cannot be greater than actual quantity.");
  }

  if (
    data.onTimeCompletionScore === undefined ||
    Number(data.onTimeCompletionScore) < 0 ||
    Number(data.onTimeCompletionScore) > 100
  ) {
    errors.push("On-time completion score must be between 0 and 100.");
  }

  if (data.plannedWorkDays === undefined || Number(data.plannedWorkDays) <= 0) {
    errors.push("Planned work days must be greater than zero.");
  }

  if (data.absentDays === undefined || Number(data.absentDays) < 0) {
    errors.push("Absent days cannot be negative.");
  }

  if (data.lateDays === undefined || Number(data.lateDays) < 0) {
    errors.push("Late days cannot be negative.");
  }

  if (
    data.plannedWorkDays !== undefined &&
    data.absentDays !== undefined &&
    Number(data.absentDays) > Number(data.plannedWorkDays)
  ) {
    errors.push("Absent days cannot be greater than planned work days.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateProductionRecordInput
};