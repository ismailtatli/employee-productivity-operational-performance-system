const express = require("express");

const auditLogController = require("../controllers/auditLogController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  auditLogController.getAuditLogs
);

module.exports = router;
