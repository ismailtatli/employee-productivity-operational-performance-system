const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authenticateToken, dashboardController.getDashboardSummary);

module.exports = router;
