const { validateLogin, validateRegister } = require("../src/validators/authValidator");

describe("Auth Validator", () => {
  test("valid login input should pass validation", () => {
    const result = validateLogin({
      email: "admin@tatleefactory.com",
      password: "TatLee123"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing email should fail validation", () => {
    const result = validateLogin({
      email: "",
      password: "TatLee123"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email is required.");
  });

  test("missing password should fail validation", () => {
    const result = validateLogin({
      email: "admin@tatleefactory.com",
      password: ""
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password is required.");
  });

  test("valid register input should pass validation", () => {
    const result = validateRegister({
      fullName: "Demo User",
      email: "demo@tatleefactory.com",
      password: "TatLee123",
      role: "Production"
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("register should fail when full name is missing", () => {
    const result = validateRegister({
      fullName: "",
      email: "demo@tatleefactory.com",
      password: "TatLee123",
      role: "Production"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Full name is required and must be at least 2 characters.");
  });

  test("register should fail when email format is invalid", () => {
    const result = validateRegister({
      fullName: "Demo User",
      email: "invalid-email",
      password: "TatLee123",
      role: "Production"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Valid email is required.");
  });

  test("register should fail when password is shorter than 6 characters", () => {
    const result = validateRegister({
      fullName: "Demo User",
      email: "demo@tatleefactory.com",
      password: "123",
      role: "Production"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password is required and must be at least 6 characters.");
  });

  test("register should fail when role is invalid", () => {
    const result = validateRegister({
      fullName: "Demo User",
      email: "demo@tatleefactory.com",
      password: "TatLee123",
      role: "InvalidRole"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invalid role.");
  });
});