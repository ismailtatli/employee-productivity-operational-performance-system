const express = require("express");
const productController = require("../controllers/productController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product list retrieved successfully
 *
 *   post:
 *     summary: Create a product
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
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticateToken, productController.getAllProducts);
router.post("/", authenticateToken, authorizeRoles("Admin", "Manager", "Production"), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.get("/:id", authenticateToken, productController.getProductById);
router.put("/:id", authenticateToken, authorizeRoles("Admin", "Manager", "Production"), productController.updateProduct);
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), productController.deleteProduct);

module.exports = router;