const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/userRepository");
const { validateLogin, validateRegister } = require("../validators/authValidator");

const JWT_SECRET = process.env.JWT_SECRET || "tatlee_factory_secret_key";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "2h"
    }
  );
}

async function login(loginData) {
  const validation = validateLogin(loginData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findUserByEmail(loginData.email);

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "Active") {
    const error = new Error("User account is inactive.");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
}

async function register(registerData) {
  const validation = validateRegister(registerData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.findUserByEmail(registerData.email);

  if (existingUser) {
    const error = new Error("Email is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(registerData.password, 10);

  const newUser = await userRepository.createUser({
    fullName: registerData.fullName.trim(),
    email: registerData.email.trim().toLowerCase(),
    passwordHash,
    role: registerData.role || "Viewer",
    status: "Active"
  });

  const token = generateToken(newUser);

  return {
    message: "Registration successful.",
    token,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    }
  };
}

async function getCurrentUser(userId) {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    data: user
  };
}

module.exports = {
  login,
  register,
  getCurrentUser
};