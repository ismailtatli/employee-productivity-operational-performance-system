/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management endpoints
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Department list retrieved successfully
 *
 *   post:
 *     summary: Create department
 *     tags: [Departments]
 *     responses:
 *       201:
 *         description: Department created successfully
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Department updated successfully
 *
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Department deleted successfully
 */
const express = require("express");

const departmentController = require("../controllers/departmentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  departmentController.getAllDepartments
);

router.get(
  "/:id",
  authenticateToken,
  departmentController.getDepartmentById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  departmentController.createDepartment
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  departmentController.deleteDepartment
);

module.exports = router;