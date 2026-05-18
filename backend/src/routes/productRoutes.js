const express = require("express");

const productController = require("../controllers/productController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management endpoints
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Returns the complete TatLee Factory product catalog.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product list retrieved successfully.
 */
router.get("/", authenticateToken, productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Returns a single product by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *       404:
 *         description: Product not found.
 */
router.get("/:id", authenticateToken, productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product
 *     description: Creates a new product. Allowed roles are Admin, Manager and Production.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productCode
 *               - productName
 *               - category
 *               - standardUnit
 *               - targetPerShift
 *             properties:
 *               productCode:
 *                 type: string
 *                 example: PRD-100
 *               productName:
 *                 type: string
 *                 example: Chocolate Wafer Box
 *               category:
 *                 type: string
 *                 example: Food Packaging
 *               standardUnit:
 *                 type: string
 *                 example: box
 *               targetPerShift:
 *                 type: integer
 *                 example: 500
 *               status:
 *                 type: string
 *                 example: Active
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  productController.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product by ID. Allowed roles are Admin, Manager and Production.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productCode
 *               - productName
 *               - category
 *               - standardUnit
 *               - targetPerShift
 *             properties:
 *               productCode:
 *                 type: string
 *                 example: PRD-100
 *               productName:
 *                 type: string
 *                 example: Updated Product
 *               category:
 *                 type: string
 *                 example: Snack
 *               standardUnit:
 *                 type: string
 *                 example: pack
 *               targetPerShift:
 *                 type: integer
 *                 example: 700
 *               status:
 *                 type: string
 *                 example: Active
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Product not found.
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  productController.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID. Only Admin can delete products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Product not found.
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  productController.deleteProduct
);

module.exports = router;