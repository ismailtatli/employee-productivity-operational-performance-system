const { validateDepartmentInput } = require("../src/validators/departmentValidator");

describe("Department Validator", () => {
  test("valid department input should pass validation", () => {
    const result = validateDepartmentInput({
      departmentName: "Maintenance",
      managerName: "Kemal Arı",
      description: "Responsible for technical maintenance operations"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing department name should fail validation", () => {
    const result = validateDepartmentInput({
      departmentName: "",
      managerName: "Kemal Arı",
      description: "Responsible for technical maintenance operations"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Department name is required.");
  });

  test("missing manager name should fail validation", () => {
    const result = validateDepartmentInput({
      departmentName: "Maintenance",
      managerName: "",
      description: "Responsible for technical maintenance operations"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Manager name is required.");
  });

  test("department name shorter than 2 characters should fail validation", () => {
    const result = validateDepartmentInput({
      departmentName: "A",
      managerName: "Kemal Arı",
      description: "Invalid department name"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Department name must be at least 2 characters.");
  });
});