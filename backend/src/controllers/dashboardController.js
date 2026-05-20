const reportService = require("../services/reportService");
const employeeRepository = require("../repositories/employeeRepository");
const departmentRepository = require("../repositories/departmentRepository");
const productRepository = require("../repositories/productRepository");
const machineRepository = require("../repositories/machineRepository");
const productionRecordRepository = require("../repositories/productionRecordRepository");
const auditLogRepository = require("../repositories/auditLogRepository");

async function getDashboardSummary(req, res) {
  try {
    const role = req.user.role;
    const [summaryResult, employees, departments, products, machines, records, auditLogs] = await Promise.all([
      reportService.getSummaryReport(null),
      employeeRepository.getAllEmployees(null),
      departmentRepository.getAllDepartments(null),
      productRepository.getAllProducts(null),
      machineRepository.getAllMachines(null),
      productionRecordRepository.getAllProductionRecords(null),
      ["Admin", "Manager"].includes(role) ? auditLogRepository.getAuditLogs({ limit: 25 }) : Promise.resolve([])
    ]);

    const summary = summaryResult.data || {};
    const totalActual = records.reduce((sum, item) => sum + Number(item.actualQuantity || 0), 0);
    const totalTarget = records.reduce((sum, item) => sum + Number(item.targetQuantity || 0), 0);
    const totalDefects = records.reduce((sum, item) => sum + Number(item.defectiveQuantity || 0), 0);

    res.status(200).json({
      data: {
        role,
        summary,
        counts: {
          employees: employees.length,
          activeEmployees: employees.filter((item) => item.status === "Active").length,
          inactiveEmployees: employees.filter((item) => item.status === "Inactive").length,
          departments: departments.length,
          products: products.length,
          machines: machines.length,
          activeMachines: machines.filter((item) => item.status === "Active").length,
          maintenanceMachines: machines.filter((item) => item.status === "Maintenance").length,
          productionRecords: records.length,
          auditLogs: auditLogs.length
        },
        production: {
          totalTarget,
          totalActual,
          totalDefects,
          targetAttainment: totalTarget > 0 ? Math.round((totalActual / totalTarget) * 10000) / 100 : 0,
          defectRate: totalActual > 0 ? Math.round((totalDefects / totalActual) * 10000) / 100 : 0
        },
        recentAuditLogs: auditLogs
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve dashboard summary."
    });
  }
}

module.exports = {
  getDashboardSummary
};
