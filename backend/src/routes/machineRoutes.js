const express = require("express");

const machineController = require("../controllers/machineController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authenticateToken, machineController.getAllMachines);
router.get("/:id", authenticateToken, machineController.getMachineById);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  machineController.createMachine
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  machineController.updateMachine
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  machineController.deleteMachine
);

module.exports = router;