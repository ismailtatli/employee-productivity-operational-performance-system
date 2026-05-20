const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = require("./app");
const { initializeDatabase } = require("./config/database");

dotenv.config();
const PORT = process.env.PORT || 5001;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee Productivity and Operational Performance Management System API",
      version: "1.0.0",
      description: "REST API documentation for the Employee Productivity and Operational Performance Management System"
    },
    servers: [{ url: "http://localhost:5001" }]
  },
  apis: [__dirname + "/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API root: http://localhost:${PORT}/`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();