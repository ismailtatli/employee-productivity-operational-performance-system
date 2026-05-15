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