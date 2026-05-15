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