const { getDatabase } = require("../config/database");

async function getAllProductionRecordsForReports(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT production_records.*,
            employees.fullName,
            employees.employeeCode,
            employees.position,
            departments.departmentName,
            products.productCode,
            products.productName,
            products.category AS productCategory,
            products.standardUnit,
            production_machines.machineCode,
            production_machines.machineName,
            production_machines.status AS machineStatus
     FROM production_records
     LEFT JOIN employees
       ON production_records.employeeId = employees.id
      AND employees.ownerUserId = production_records.ownerUserId
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.ownerUserId = production_records.ownerUserId
     LEFT JOIN products
       ON production_records.productId = products.id
      AND products.ownerUserId = production_records.ownerUserId
     LEFT JOIN production_machines
       ON production_records.machineId = production_machines.id
      AND production_machines.ownerUserId = production_records.ownerUserId
     WHERE production_records.ownerUserId = ?
     ORDER BY production_records.recordDate DESC, production_records.id DESC`,
    ownerUserId
  );
}

async function getEmployeeSummary(ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT 
       COUNT(*) AS totalEmployees,
       SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS activeEmployees,
       SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS inactiveEmployees
     FROM employees
     WHERE ownerUserId = ?`,
    ownerUserId
  );
}

async function getProductionSummary(ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT
       COUNT(*) AS totalProductionRecords,
       COALESCE(SUM(actualQuantity), 0) AS totalActualProduction,
       COALESCE(SUM(defectiveQuantity), 0) AS totalDefectiveQuantity,
       COALESCE(AVG(onTimeCompletionScore), 0) AS averageOnTimeCompletionScore
     FROM production_records
     WHERE ownerUserId = ?`,
    ownerUserId
  );
}

async function getDepartmentPerformance(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT 
       departments.id AS departmentId,
       departments.departmentName,
       COUNT(production_records.id) AS recordCount,
       COALESCE(SUM(production_records.actualQuantity), 0) AS totalActualProduction,
       COALESCE(SUM(production_records.defectiveQuantity), 0) AS totalDefectiveQuantity,
       COALESCE(AVG(production_records.onTimeCompletionScore), 0) AS averageOnTimeCompletionScore
     FROM departments
     LEFT JOIN employees
       ON departments.id = employees.departmentId
      AND employees.ownerUserId = departments.ownerUserId
     LEFT JOIN production_records
       ON employees.id = production_records.employeeId
      AND production_records.ownerUserId = departments.ownerUserId
     WHERE departments.ownerUserId = ?
     GROUP BY departments.id
     ORDER BY departments.departmentName ASC`,
    ownerUserId
  );
}

module.exports = {
  getAllProductionRecordsForReports,
  getEmployeeSummary,
  getProductionSummary,
  getDepartmentPerformance
};