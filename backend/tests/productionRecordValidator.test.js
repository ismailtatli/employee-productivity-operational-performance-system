const { validateProductionRecordInput } = require("../src/validators/productionRecordValidator");

describe("Production Record Validator", () => {
  const validRecord = {
    employeeId: 1,
    productId: 1,
    machineId: 1,
    recordDate: "2026-05-01",
    period: "2026-Q2",
    productType: "Packaging Unit",
    targetQuantity: 500,
    actualQuantity: 465,
    defectiveQuantity: 12,
    onTimeCompletionScore: 90,
    plannedWorkDays: 22,
    absentDays: 1,
    lateDays: 2,
    notes: "Valid production record"
  };

  test("valid production record input should pass validation", () => {
    const result = validateProductionRecordInput(validRecord);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("target quantity must be greater than zero", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      targetQuantity: 0
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Target quantity must be greater than zero.");
  });

  test("actual quantity must be greater than zero", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      actualQuantity: 0
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Actual quantity must be greater than zero.");
  });

  test("defective quantity cannot be negative", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      defectiveQuantity: -1
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Defective quantity cannot be negative.");
  });

  test("defective quantity cannot be greater than actual quantity", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      actualQuantity: 100,
      defectiveQuantity: 120
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Defective quantity cannot be greater than actual quantity.");
  });

  test("on-time completion score must be between 0 and 100", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      onTimeCompletionScore: 120
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("On-time completion score must be between 0 and 100.");
  });

  test("planned work days must be greater than zero", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      plannedWorkDays: 0
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Planned work days must be greater than zero.");
  });

  test("absent days cannot be greater than planned work days", () => {
    const result = validateProductionRecordInput({
      ...validRecord,
      plannedWorkDays: 20,
      absentDays: 25
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Absent days cannot be greater than planned work days.");
  });

  test("missing product id should fail validation", () => {
  const result = validateProductionRecordInput({
    ...validRecord,
    productId: 0
  });

  expect(result.isValid).toBe(false);
  expect(result.errors).toContain("Valid product is required.");
});

test("missing machine id should fail validation", () => {
  const result = validateProductionRecordInput({
    ...validRecord,
    machineId: 0
  });

  expect(result.isValid).toBe(false);
  expect(result.errors).toContain("Valid production machine is required.");
});
});