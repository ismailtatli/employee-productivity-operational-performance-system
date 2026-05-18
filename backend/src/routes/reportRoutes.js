const express = require("express");

const reportController = require("../controllers/reportController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authenticateToken, reportController.getSummaryReport);

router.get("/top-performers", authenticateToken, reportController.getTopPerformers);

router.get(
  "/bonus-eligible",
  authenticateToken,
  reportController.getBonusEligibleEmployees
);

router.get(
  "/promotion-candidates",
  authenticateToken,
  reportController.getPromotionCandidates
);

router.get(
  "/low-continuity",
  authenticateToken,
  reportController.getLowContinuityEmployees
);

router.get(
  "/hr-review-required",
  authenticateToken,
  reportController.getHrReviewRequired
);

router.get(
  "/department-performance",
  authenticateToken,
  reportController.getDepartmentPerformance
);

module.exports = router;