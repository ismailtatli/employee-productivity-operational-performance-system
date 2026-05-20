const { getDatabase } = require("../config/database");

function ownerFilter(column, ownerUserId, prefix = "WHERE", extra = "") {
  const clauses = [];
  if (extra) clauses.push(extra);
  if (ownerUserId !== null) clauses.push(`${column} = ?`);
  return clauses.length ? `${prefix} ${clauses.join(" AND ")}` : "";
}

function ownerParams(ownerUserId) {
  return ownerUserId === null ? [] : [ownerUserId];
}

async function getAllEmployeesForReports(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT employees.*,
            departments.departmentName
     FROM employees
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.ownerUserId = employees.ownerUserId
      AND departments.deletedAt IS NULL
     ${ownerFilter("employees.ownerUserId", ownerUserId, "WHERE", "employees.deletedAt IS NULL")}
     ORDER BY employees.employeeCode ASC`,
    ownerParams(ownerUserId)
  );
}

async function getAllProductionRecordsForReports(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT production_records.*,
            employees.fullName,
            employees.employeeCode,
            employees.position,
            employees.departmentId,
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
      AND employees.deletedAt IS NULL
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.ownerUserId = production_records.ownerUserId
      AND departments.deletedAt IS NULL
     LEFT JOIN products
       ON production_records.productId = products.id
      AND products.ownerUserId = production_records.ownerUserId
      AND products.deletedAt IS NULL
     LEFT JOIN production_machines
       ON production_records.machineId = production_machines.id
      AND production_machines.ownerUserId = production_records.ownerUserId
      AND production_machines.deletedAt IS NULL
     ${ownerFilter("production_records.ownerUserId", ownerUserId, "WHERE", "production_records.deletedAt IS NULL")}
     ORDER BY production_records.recordDate DESC, production_records.id DESC`,
    ownerParams(ownerUserId)
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
     ${ownerFilter("ownerUserId", ownerUserId, "WHERE", "deletedAt IS NULL")}`,
    ownerParams(ownerUserId)
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
     ${ownerFilter("ownerUserId", ownerUserId, "WHERE", "deletedAt IS NULL")}`,
    ownerParams(ownerUserId)
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
      AND employees.deletedAt IS NULL
     LEFT JOIN production_records
       ON employees.id = production_records.employeeId
      AND production_records.ownerUserId = departments.ownerUserId
      AND production_records.deletedAt IS NULL
     ${ownerFilter("departments.ownerUserId", ownerUserId, "WHERE", "departments.deletedAt IS NULL")}
     GROUP BY departments.id
     ORDER BY departments.departmentName ASC`,
    ownerParams(ownerUserId)
  );
}

module.exports = {
  getAllEmployeesForReports,
  getAllProductionRecordsForReports,
  getEmployeeSummary,
  getProductionSummary,
  getDepartmentPerformance
};
