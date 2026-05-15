const express = require("express");

const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @description Login with email and password
 */
router.post("/login", authController.login);

/**
 * @route GET /api/auth/me
 * @description Get currently authenticated user
 */
router.get("/me", authenticateToken, authController.me);

/**
 * @route POST /api/auth/logout
 * @description Client-side logout helper
 */
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;