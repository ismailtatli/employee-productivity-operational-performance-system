const express = require("express");

const employeeController = require("../controllers/employeeController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

const canReadEmployees = authorizeRoles("Admin", "Manager", "Production", "HR");

router.get(
  "/",
  authenticateToken,
  canReadEmployees,
  employeeController.getAllEmployees
);

router.get(
  "/search",
  authenticateToken,
  canReadEmployees,
  employeeController.searchEmployees
);

router.get(
  "/department/:departmentId",
  authenticateToken,
  canReadEmployees,
  employeeController.getEmployeesByDepartment
);

router.get(
  "/:id",
  authenticateToken,
  canReadEmployees,
  employeeController.getEmployeeById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "HR"),
  employeeController.createEmployee
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "HR"),
  employeeController.updateEmployee
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  employeeController.deleteEmployee
);

module.exports = router;
