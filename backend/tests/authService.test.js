const { validateLoginInput } = require("../src/validators/authValidator");

describe("Auth Validator", () => {
  test("valid login input should pass validation", () => {
    const result = validateLoginInput({
      email: "admin@tatleefactory.com",
      password: "TatLee123"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing email should fail validation", () => {
    const result = validateLoginInput({
      email: "",
      password: "TatLee123"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email is required.");
  });

  test("missing password should fail validation", () => {
    const result = validateLoginInput({
      email: "admin@tatleefactory.com",
      password: ""
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password is required.");
  });

  test("invalid email format should fail validation", () => {
    const result = validateLoginInput({
      email: "invalid-email",
      password: "TatLee123"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email format is invalid.");
  });
});