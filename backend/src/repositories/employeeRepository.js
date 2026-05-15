const { getDatabase } = require("../config/database");

async function getAllEmployees() {
  const database = await getDatabase();

  return database.all(`
    SELECT 
      employees.*,
      departments.departmentName
    FROM employees
    LEFT JOIN departments ON employees.departmentId = departments.id
    ORDER BY employees.id ASC
  `);
}

async function getEmployeeById(id) {
  const database = await getDatabase();

  return database.get(`
    SELECT 
      employees.*,
      departments.departmentName
    FROM employees
    LEFT JOIN departments ON employees.departmentId = departments.id
    WHERE employees.id = ?
  `, [id]);
}

async function searchEmployees(query) {
  const database = await getDatabase();
  const searchTerm = `%${query}%`;

  return database.all(`
    SELECT 
      employees.*,
      departments.departmentName
    FROM employees
    LEFT JOIN departments ON employees.departmentId = departments.id
    WHERE employees.fullName LIKE ?
       OR employees.employeeCode LIKE ?
       OR employees.email LIKE ?
       OR employees.position LIKE ?
    ORDER BY employees.id ASC
  `, [searchTerm, searchTerm, searchTerm, searchTerm]);
}

async function getEmployeesByDepartment(departmentId) {
  const database = await getDatabase();

  return database.all(`
    SELECT 
      employees.*,
      departments.departmentName
    FROM employees
    LEFT JOIN departments ON employees.departmentId = departments.id
    WHERE employees.departmentId = ?
    ORDER BY employees.id ASC
  `, [departmentId]);
}

async function createEmployee(employee) {
  const database = await getDatabase();

  const result = await database.run(`
    INSERT INTO employees 
    (fullName, employeeCode, email, position, departmentId, hireDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    employee.fullName,
    employee.employeeCode,
    employee.email,
    employee.position,
    employee.departmentId,
    employee.hireDate,
    employee.status || "Active"
  ]);

  return getEmployeeById(result.lastID);
}

async function updateEmployee(id, employee) {
  const database = await getDatabase();

  await database.run(`
    UPDATE employees
    SET fullName = ?,
        employeeCode = ?,
        email = ?,
        position = ?,
        departmentId = ?,
        hireDate = ?,
        status = ?
    WHERE id = ?
  `, [
    employee.fullName,
    employee.employeeCode,
    employee.email,
    employee.position,
    employee.departmentId,
    employee.hireDate,
    employee.status,
    id
  ]);

  return getEmployeeById(id);
}

async function deleteEmployee(id) {
  const database = await getDatabase();

  const result = await database.run(
    "DELETE FROM employees WHERE id = ?",
    [id]
  );

  return result.changes > 0;
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  getEmployeesByDepartment,
  createEmployee,
  updateEmployee,
  deleteEmployee
};