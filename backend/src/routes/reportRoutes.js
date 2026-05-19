/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Smart reporting endpoints
 */

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Get report summary
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Summary generated successfully
 */

/**
 * @swagger
 * /api/reports/top-performers:
 *   get:
 *     summary: Get top performers
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Top performers retrieved successfully
 */

/**
 * @swagger
 * /api/reports/bonus-eligible:
 *   get:
 *     summary: Get bonus eligible employees
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Bonus eligible employees retrieved successfully
 */

/**
 * @swagger
 * /api/reports/promotion-candidates:
 *   get:
 *     summary: Get promotion candidates
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Promotion candidates retrieved successfully
 */
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