const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const productionRecordRoutes = require("./routes/productionRecordRoutes");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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