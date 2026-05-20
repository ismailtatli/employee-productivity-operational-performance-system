/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User list retrieved successfully
 *
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User updated successfully
 *
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted successfully
 */