const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc"); // 🔥 FIX: eksik import

const swaggerSpec = require("./swagger");

const productRoutes = require("./routes/productRoutes");
const machineRoutes = require("./routes/machineRoutes");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const productionRecordRoutes = require("./routes/productionRecordRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee Productivity Operational Performance API",
      version: "1.0.0",
      description:
        "REST API documentation for the Employee Productivity and Operational Performance Management System"
    },
    servers: [
      {
        url: "http://localhost:5001"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpecGenerated = swaggerJsdoc(swaggerOptions); // 🔥 FIX: duplicate hatayı önlemek için isim değişti

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecGenerated));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecGenerated));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Employee Productivity and Operational Performance Management System API",
    company: "TatLee Factory",
    status: "Running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/production-records", productionRecordRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/products", productRoutes);
app.use("/api/machines", machineRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found."
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error."
  });
});

module.exports = app;