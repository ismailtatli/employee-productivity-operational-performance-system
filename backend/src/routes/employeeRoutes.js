/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Employee list retrieved successfully
 *
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     responses:
 *       201:
 *         description: Employee created successfully
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 */
const express = require("express");

const employeeController = require("../controllers/employeeController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  employeeController.getAllEmployees
);

router.get(
  "/search",
  authenticateToken,
  employeeController.searchEmployees
);

router.get(
  "/department/:departmentId",
  authenticateToken,
  employeeController.getEmployeesByDepartment
);

router.get(
  "/:id",
  authenticateToken,
  employeeController.getEmployeeById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  employeeController.createEmployee
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  employeeController.updateEmployee
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  employeeController.deleteEmployee
);

module.exports = router;