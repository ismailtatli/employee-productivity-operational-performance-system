const { getDatabase } = require("../config/database");

function scopeWhere(ownerUserId, extra = []) {
  const clauses = ["departments.deletedAt IS NULL", ...extra];
  const params = [];
  if (ownerUserId !== null) {
    clauses.push("departments.ownerUserId = ?");
    params.push(ownerUserId);
  }
  return { sql: `WHERE ${clauses.join(" AND ")}`, params };
}

async function getAllDepartments(ownerUserId) {
  const database = await getDatabase();
  const scope = scopeWhere(ownerUserId);
  return database.all(
    `SELECT departments.*, COUNT(employees.id) AS employeeCount
     FROM departments
     LEFT JOIN employees
       ON departments.id = employees.departmentId
      AND employees.deletedAt IS NULL
     ${scope.sql}
     GROUP BY departments.id
     ORDER BY departments.departmentName ASC`,
    scope.params
  );
}

async function getDepartmentById(id, ownerUserId) {
  const database = await getDatabase();
  const scope = scopeWhere(ownerUserId, ["departments.id = ?"]);
  return database.get(
    `SELECT departments.*, COUNT(employees.id) AS employeeCount
     FROM departments
     LEFT JOIN employees
       ON departments.id = employees.departmentId
      AND employees.deletedAt IS NULL
     ${scope.sql}
     GROUP BY departments.id`,
    [id, ...scope.params]
  );
}

async function createDepartment(departmentData, ownerUserId) {
  const database = await getDatabase();
  const result = await database.run(
    `INSERT INTO departments (ownerUserId, departmentName, managerName, description) VALUES (?, ?, ?, ?)`,
    [ownerUserId, departmentData.departmentName, departmentData.managerName, departmentData.description || ""]
  );
  return getDepartmentById(result.lastID, ownerUserId);
}

async function updateDepartment(id, departmentData, ownerUserId) {
  const database = await getDatabase();
  const where = ownerUserId === null
    ? "WHERE id = ? AND deletedAt IS NULL"
    : "WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL";
  const params = [departmentData.departmentName, departmentData.managerName, departmentData.description || "", id];
  if (ownerUserId !== null) params.push(ownerUserId);
  await database.run(`UPDATE departments SET departmentName = ?, managerName = ?, description = ? ${where}`, params);
  return getDepartmentById(id, ownerUserId);
}

async function deleteDepartment(id, ownerUserId) {
  const database = await getDatabase();
  const department = await getDepartmentById(id, ownerUserId);
  if (!department) return null;
  if (ownerUserId === null) await database.run(`UPDATE departments SET deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND deletedAt IS NULL`, id);
  else await database.run(`UPDATE departments SET deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL`, [id, ownerUserId]);
  return department;
}

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
