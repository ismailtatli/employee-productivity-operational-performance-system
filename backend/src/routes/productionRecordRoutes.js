const express = require("express");

const productionRecordController = require("../controllers/productionRecordController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  productionRecordController.getAllProductionRecords
);

router.get(
  "/employee/:employeeId",
  authenticateToken,
  productionRecordController.getProductionRecordsByEmployee
);

router.get(
  "/:id",
  authenticateToken,
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