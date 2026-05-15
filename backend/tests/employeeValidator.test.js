const { validateEmployeeInput } = require("../src/validators/employeeValidator");

describe("Employee Validator", () => {
  test("valid employee input should pass validation", () => {
    const result = validateEmployeeInput({
      fullName: "Ali Vural",
      employeeCode: "EMP-100",
      email: "ali.vural@tatleefactory.com",
      position: "Production Operator",
      departmentId: 1,
      hireDate: "2026-05-10",
      status: "Active"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing full name should fail validation", () => {
    const result = validateEmployeeInput({
      fullName: "",
      employeeCode: "EMP-100",
      email: "ali.vural@tatleefactory.com",
      position: "Production Operator",
      departmentId: 1,
      hireDate: "2026-05-10",
      status: "Active"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Full name is required.");
  });

  test("invalid email should fail validation", () => {
    const result = validateEmployeeInput({
      fullName: "Ali Vural",
      employeeCode: "EMP-100",
      email: "invalid-email",
      position: "Production Operator",
      departmentId: 1,
      hireDate: "2026-05-10",
      status: "Active"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email format is invalid.");
  });

  test("invalid status should fail validation", () => {
    const result = validateEmployeeInput({
      fullName: "Ali Vural",
      employeeCode: "EMP-100",
      email: "ali.vural@tatleefactory.com",
      position: "Production Operator",
      departmentId: 1,
      hireDate: "2026-05-10",
      status: "Suspended"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Status must be Active or Inactive.");
  });
});