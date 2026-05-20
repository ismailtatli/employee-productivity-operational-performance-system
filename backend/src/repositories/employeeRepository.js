const { getDatabase } = require("../config/database");

function ownerWhere(alias, ownerUserId, extra = []) {
  const clauses = [`${alias}.deletedAt IS NULL`, ...extra];
  const params = [];
  if (ownerUserId !== null) {
    clauses.push(`${alias}.ownerUserId = ?`);
    params.push(ownerUserId);
  }
  return { sql: `WHERE ${clauses.join(" AND ")}`, params };
}

async function getAllEmployees(ownerUserId) {
  const database = await getDatabase();
  const scope = ownerWhere("employees", ownerUserId);
  return database.all(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.deletedAt IS NULL
     ${scope.sql}
     ORDER BY employees.employeeCode ASC`,
    scope.params
  );
}

async function getEmployeeById(id, ownerUserId) {
  const database = await getDatabase();
  const scope = ownerWhere("employees", ownerUserId, ["employees.id = ?"]);
  return database.get(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.deletedAt IS NULL
     ${scope.sql}`,
    [id, ...scope.params]
  );
}

async function getEmployeesByDepartment(departmentId, ownerUserId) {
  const database = await getDatabase();
  const scope = ownerWhere("employees", ownerUserId, ["employees.departmentId = ?"]);
  return database.all(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.deletedAt IS NULL
     ${scope.sql}
     ORDER BY employees.employeeCode ASC`,
    [departmentId, ...scope.params]
  );
}

async function searchEmployees(query, ownerUserId) {
  const database = await getDatabase();
  const searchQuery = `%${query}%`;
  const scope = ownerWhere("employees", ownerUserId, [`(
       employees.fullName LIKE ? OR employees.employeeCode LIKE ? OR employees.email LIKE ?
       OR employees.position LIKE ? OR departments.departmentName LIKE ?
     )`]);
  return database.all(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.deletedAt IS NULL
     ${scope.sql}
     ORDER BY employees.employeeCode ASC`,
    [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, ...scope.params]
  );
}

async function createEmployee(employeeData, ownerUserId) {
  const database = await getDatabase();
  const result = await database.run(
    `INSERT INTO employees
     (ownerUserId, fullName, employeeCode, email, position, departmentId, hireDate, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [ownerUserId, employeeData.fullName, employeeData.employeeCode, employeeData.email,
     employeeData.position, employeeData.departmentId, employeeData.hireDate, employeeData.status || "Active"]
  );
  return getEmployeeById(result.lastID, ownerUserId);
}

async function updateEmployee(id, employeeData, ownerUserId) {
  const database = await getDatabase();
  const where = ownerUserId === null ? "WHERE id = ? AND deletedAt IS NULL" : "WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL";
  const params = [employeeData.fullName, employeeData.employeeCode, employeeData.email, employeeData.position,
    employeeData.departmentId, employeeData.hireDate, employeeData.status || "Active", id];
  if (ownerUserId !== null) params.push(ownerUserId);
  await database.run(
    `UPDATE employees SET fullName = ?, employeeCode = ?, email = ?, position = ?, departmentId = ?, hireDate = ?, status = ? ${where}`,
    params
  );
  return getEmployeeById(id, ownerUserId);
}

async function deleteEmployee(id, ownerUserId) {
  const database = await getDatabase();
  const employee = await getEmployeeById(id, ownerUserId);
  if (!employee) return null;
  if (ownerUserId === null) await database.run(`UPDATE employees SET status = 'Inactive', deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND deletedAt IS NULL`, id);
  else await database.run(`UPDATE employees SET status = 'Inactive', deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL`, [id, ownerUserId]);
  return employee;
}

async function getProductionAssignableEmployees() {
  const database = await getDatabase();
  return database.all(`
    SELECT employees.*, departments.departmentName
    FROM employees
    LEFT JOIN departments
      ON employees.departmentId = departments.id
     AND departments.deletedAt IS NULL
    WHERE employees.status = 'Active'
      AND employees.deletedAt IS NULL
      AND (departments.departmentName IN ('Production', 'Packaging', 'Logistics')
        OR LOWER(employees.position) LIKE '%operator%'
        OR LOWER(employees.position) LIKE '%worker%'
        OR LOWER(employees.position) LIKE '%line%'
        OR LOWER(employees.position) LIKE '%machine%'
        OR LOWER(employees.position) LIKE '%packaging%'
        OR LOWER(employees.position) LIKE '%shift%'
        OR LOWER(employees.position) LIKE '%production%')
    ORDER BY employees.fullName ASC`);
}

module.exports = { getProductionAssignableEmployees, getAllEmployees, getEmployeeById, getEmployeesByDepartment, searchEmployees, createEmployee, updateEmployee, deleteEmployee };
