const express = require("express");
const machineController = require("../controllers/machineController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: Machine management endpoints
 */

/**
 * @swagger
 * /api/machines:
 *   get:
 *     summary: Get all machines
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Machine list retrieved successfully
 *
 *   post:
 *     summary: Create machine
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machineCode
 *               - machineName
 *               - departmentId
 *               - capacityPerShift
 *             properties:
 *               machineCode:
 *                 type: string
 *                 example: MCH-100
 *               machineName:
 *                 type: string
 *                 example: Filling Line C
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: Active
 *               capacityPerShift:
 *                 type: integer
 *                 example: 800
 *               description:
 *                 type: string
 *                 example: High-volume production line.
 *     responses:
 *       201:
 *         description: Machine created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticateToken, authorizeRoles("Admin", "Manager", "Production"), machineController.getAllMachines);
router.post("/", authenticateToken, authorizeRoles("Admin", "Manager", "Production"), machineController.createMachine);

/**
 * @swagger
 * /api/machines/{id}:
 *   get:
 *     summary: Get machine by ID
 *     tags: [Machines]
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
 *         description: Machine retrieved successfully
 *       404:
 *         description: Machine not found
 *
 *   put:
 *     summary: Update machine
 *     tags: [Machines]
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
 *               - machineCode
 *               - machineName
 *               - departmentId
 *               - capacityPerShift
 *             properties:
 *               machineCode:
 *                 type: string
 *                 example: MCH-100
 *               machineName:
 *                 type: string
 *                 example: Updated Filling Line
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: Maintenance
 *               capacityPerShift:
 *                 type: integer
 *                 example: 900
 *               description:
 *                 type: string
 *                 example: Updated description.
 *     responses:
 *       200:
 *         description: Machine updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Machine not found
 *
 *   delete:
 *     summary: Delete machine
 *     tags: [Machines]
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
 *         description: Machine deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Machine not found
 */
router.get("/:id", authenticateToken, authorizeRoles("Admin", "Manager", "Production"), machineController.getMachineById);
router.put("/:id", authenticateToken, authorizeRoles("Admin", "Manager", "Production"), machineController.updateMachine);
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), machineController.deleteMachine);

module.exports = router;