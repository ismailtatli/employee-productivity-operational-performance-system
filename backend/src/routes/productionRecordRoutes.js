/**
 * @swagger
 * tags:
 *   name: Production Records
 *   description: Production operation endpoints
 */

/**
 * @swagger
 * /api/production-records:
 *   get:
 *     summary: Get all production records
 *     tags: [Production Records]
 *     responses:
 *       200:
 *         description: Production records retrieved successfully
 *
 *   post:
 *     summary: Create production record
 *     tags: [Production Records]
 *     responses:
 *       201:
 *         description: Production record created successfully
 */

/**
 * @swagger
 * /api/production-records/{id}:
 *   get:
 *     summary: Get production record by ID
 *     tags: [Production Records]
 *     responses:
 *       200:
 *         description: Production record retrieved successfully
 *
 *   put:
 *     summary: Update production record
 *     tags: [Production Records]
 *     responses:
 *       200:
 *         description: Production record updated successfully
 *
 *   delete:
 *     summary: Delete production record
 *     tags: [Production Records]
 *     responses:
 *       200:
 *         description: Production record deleted successfully
 */
const express = require("express");

const productionRecordController = require("../controllers/productionRecordController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production", "Quality"),
  productionRecordController.getAllProductionRecords
);

router.get(
  "/employee/:employeeId",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production", "Quality"),
  productionRecordController.getProductionRecordsByEmployee
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production", "Quality"),
  productionRecordController.getProductionRecordById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  productionRecordController.createProductionRecord
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  productionRecordController.updateProductionRecord
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  productionRecordController.deleteProductionRecord
);

module.exports = router;