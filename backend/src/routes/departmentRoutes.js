const express = require("express");

const departmentController = require("../controllers/departmentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

const canReadDepartments = authorizeRoles("Admin", "Manager", "HR");

router.get(
  "/",
  authenticateToken,
  canReadDepartments,
  departmentController.getAllDepartments
);

router.get(
  "/:id",
  authenticateToken,
  canReadDepartments,
  departmentController.getDepartmentById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "HR"),
  departmentController.createDepartment
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "HR"),
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  departmentController.deleteDepartment
);

module.exports = router;
