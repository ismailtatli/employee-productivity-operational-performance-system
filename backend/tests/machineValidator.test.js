const { validateMachineInput } = require("../src/validators/machineValidator");

describe("Machine Validator", () => {
  test("valid machine input should pass validation", () => {
    const result = validateMachineInput({
      machineCode: "MCH-100",
      machineName: "Test Machine",
      departmentId: 1,
      status: "Active",
      capacityPerShift: 800,
      description: "Test machine"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing machine code should fail validation", () => {
    const result = validateMachineInput({
      machineCode: "",
      machineName: "Test Machine",
      departmentId: 1,
      status: "Active",
      capacityPerShift: 800
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Machine code is required.");
  });

  test("invalid machine status should fail validation", () => {
    const result = validateMachineInput({
      machineCode: "MCH-100",
      machineName: "Test Machine",
      departmentId: 1,
      status: "Broken",
      capacityPerShift: 800
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Status must be Active, Maintenance or Inactive.");
  });
});