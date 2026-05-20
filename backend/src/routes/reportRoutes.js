const express = require("express");

const reportController = require("../controllers/reportController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

const canReadReports = authorizeRoles("Admin", "Manager");

router.get("/summary", authenticateToken, canReadReports, reportController.getSummaryReport);

router.get("/employees", authenticateToken, canReadReports, reportController.getEmployeeReports);

router.get("/top-performers", authenticateToken, canReadReports, reportController.getTopPerformers);

router.get(
  "/bonus-eligible",
  authenticateToken,
  canReadReports,
  reportController.getBonusEligibleEmployees
);

router.get(
  "/promotion-candidates",
  authenticateToken,
  canReadReports,
  reportController.getPromotionCandidates
);

router.get(
  "/low-continuity",
  authenticateToken,
  canReadReports,
  reportController.getLowContinuityEmployees
);

router.get(
  "/hr-review-required",
  authenticateToken,
  canReadReports,
  reportController.getHrReviewRequired
);

router.get(
  "/department-performance",
  authenticateToken,
  canReadReports,
  reportController.getDepartmentPerformance
);

module.exports = router;
