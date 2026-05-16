function validateProductInput(data) {
  const errors = [];

  if (!data.productCode || data.productCode.trim() === "") {
    errors.push("Product code is required.");
  }

  if (!data.productName || data.productName.trim() === "") {
    errors.push("Product name is required.");
  }

  if (!data.category || data.category.trim() === "") {
    errors.push("Category is required.");
  }

  if (!data.standardUnit || data.standardUnit.trim() === "") {
    errors.push("Standard unit is required.");
  }

  if (data.targetPerShift === undefined || Number(data.targetPerShift) <= 0) {
    errors.push("Target per shift must be greater than zero.");
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
  validateProductInput
};