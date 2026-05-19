const { getDatabase } = require("../config/database");

async function getAllEmployees(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments ON employees.departmentId = departments.id
     WHERE employees.ownerUserId = ?
     ORDER BY employees.employeeCode ASC`,
    ownerUserId
  );
}

async function getEmployeeById(id, ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments ON employees.departmentId = departments.id
     WHERE employees.id = ?
       AND employees.ownerUserId = ?`,
    [id, ownerUserId]
  );
}

async function getEmployeesByDepartment(departmentId, ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments ON employees.departmentId = departments.id
     WHERE employees.departmentId = ?
       AND employees.ownerUserId = ?
     ORDER BY employees.employeeCode ASC`,
    [departmentId, ownerUserId]
  );
}

async function searchEmployees(query, ownerUserId) {
  const database = await getDatabase();
  const searchQuery = `%${query}%`;

  return database.all(
    `SELECT employees.*, departments.departmentName
     FROM employees
     LEFT JOIN departments ON employees.departmentId = departments.id
     WHERE employees.ownerUserId = ?
       AND (
         employees.fullName LIKE ?
         OR employees.employeeCode LIKE ?
         OR employees.email LIKE ?
         OR employees.position LIKE ?
         OR departments.departmentName LIKE ?
       )
     ORDER BY employees.employeeCode ASC`,
    [
      ownerUserId,
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery
    ]
  );
}

async function createEmployee(employeeData, ownerUserId) {
  const database = await getDatabase();

  const result = await database.run(
    `INSERT INTO employees
     (ownerUserId, fullName, employeeCode, email, position, departmentId, hireDate, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ownerUserId,
      employeeData.fullName,
      employeeData.employeeCode,
      employeeData.email,
      employeeData.position,
      employeeData.departmentId,
      employeeData.hireDate,
      employeeData.status || "Active"
    ]
  );

  return getEmployeeById(result.lastID, ownerUserId);
}

async function updateEmployee(id, employeeData, ownerUserId) {
  const database = await getDatabase();

  await database.run(
    `UPDATE employees
     SET fullName = ?,
         employeeCode = ?,
         email = ?,
         position = ?,
         departmentId = ?,
         hireDate = ?,
         status = ?
     WHERE id = ? AND ownerUserId = ?`,
    [
      employeeData.fullName,
      employeeData.employeeCode,
      employeeData.email,
      employeeData.position,
      employeeData.departmentId,
      employeeData.hireDate,
      employeeData.status || "Active",
      id,
      ownerUserId
    ]
  );

  return getEmployeeById(id, ownerUserId);
}

async function deleteEmployee(id, ownerUserId) {
  const database = await getDatabase();

  const employee = await getEmployeeById(id, ownerUserId);

  if (!employee) {
    return null;
  }

  await database.run(
    `DELETE FROM employees
     WHERE id = ? AND ownerUserId = ?`,
    [id, ownerUserId]
  );

  return employee;
}


async function getProductionAssignableEmployees() {
  const database = await getDatabase();

  return database.all(
    `
    SELECT
      employees.*,
      departments.departmentName
    FROM employees
    LEFT JOIN departments ON employees.departmentId = departments.id
    WHERE employees.status = 'Active'
      AND (
        departments.departmentName IN ('Production', 'Packaging', 'Logistics')
        OR LOWER(employees.position) LIKE '%operator%'
        OR LOWER(employees.position) LIKE '%worker%'
        OR LOWER(employees.position) LIKE '%line%'
        OR LOWER(employees.position) LIKE '%machine%'
        OR LOWER(employees.position) LIKE '%packaging%'
        OR LOWER(employees.position) LIKE '%shift%'
        OR LOWER(employees.position) LIKE '%production%'
      )
    ORDER BY employees.fullName ASC
    `
  );
}

module.exports = {
  getProductionAssignableEmployees,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByDepartment,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};