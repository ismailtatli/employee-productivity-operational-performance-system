const express = require("express");

const productController = require("../controllers/productController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authenticateToken, productController.getAllProducts);
router.get("/:id", authenticateToken, productController.getProductById);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  productController.createProduct
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  productController.deleteProduct
);

module.exports = router;