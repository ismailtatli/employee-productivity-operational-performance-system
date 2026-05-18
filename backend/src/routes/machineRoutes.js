const express = require("express");

const machineController = require("../controllers/machineController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: Production machine management endpoints
 */

/**
 * @swagger
 * /machines:
 *   get:
 *     summary: Get all production machines
 *     description: Returns all production machines with department information.
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Machine list retrieved successfully.
 */
router.get("/", authenticateToken, machineController.getAllMachines);

/**
 * @swagger
 * /machines/{id}:
 *   get:
 *     summary: Get production machine by ID
 *     description: Returns a single production machine by its ID.
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Machine ID
 *     responses:
 *       200:
 *         description: Machine retrieved successfully.
 *       404:
 *         description: Machine not found.
 */
router.get("/:id", authenticateToken, machineController.getMachineById);

/**
 * @swagger
 * /machines:
 *   post:
 *     summary: Create a production machine
 *     description: Creates a new production machine. Allowed roles are Admin, Manager and Production.
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
 *                 example: High-volume production line for packaged goods.
 *     responses:
 *       201:
 *         description: Production machine created successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  machineController.createMachine
);

/**
 * @swagger
 * /machines/{id}:
 *   put:
 *     summary: Update a production machine
 *     description: Updates an existing production machine by ID. Allowed roles are Admin, Manager and Production.
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Machine ID
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
 *                 example: Updated machine description.
 *     responses:
 *       200:
 *         description: Production machine updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Machine not found.
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Production"),
  machineController.updateMachine
);

/**
 * @swagger
 * /machines/{id}:
 *   delete:
 *     summary: Delete a production machine
 *     description: Deletes a production machine by ID. Only Admin can delete machines.
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Machine ID
 *     responses:
 *       200:
 *         description: Production machine deleted successfully.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Machine not found.
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  machineController.deleteMachine
);

module.exports = router;