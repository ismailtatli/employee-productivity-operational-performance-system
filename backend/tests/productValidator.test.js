const { validateProductInput } = require("../src/validators/productValidator");

describe("Product Validator", () => {
  test("valid product input should pass validation", () => {
    const result = validateProductInput({
      productCode: "PRD-100",
      productName: "Test Product",
      category: "Test Category",
      standardUnit: "box",
      targetPerShift: 500,
      status: "Active"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing product code should fail validation", () => {
    const result = validateProductInput({
      productCode: "",
      productName: "Test Product",
      category: "Test Category",
      standardUnit: "box",
      targetPerShift: 500,
      status: "Active"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Product code is required.");
  });

  test("target per shift must be greater than zero", () => {
    const result = validateProductInput({
      productCode: "PRD-100",
      productName: "Test Product",
      category: "Test Category",
      standardUnit: "box",
      targetPerShift: 0,
      status: "Active"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Target per shift must be greater than zero.");
  });
});