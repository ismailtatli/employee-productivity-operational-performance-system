const { getDatabase } = require("../config/database");

async function getAllDepartments() {
  const database = await getDatabase();

  return database.all(`
    SELECT 
      departments.*,
      COUNT(employees.id) AS employeeCount
    FROM departments
    LEFT JOIN employees ON employees.departmentId = departments.id
    GROUP BY departments.id
    ORDER BY departments.id ASC
  `);
}

async function getDepartmentById(id) {
  const database = await getDatabase();

  return database.get(`
    SELECT 
      departments.*,
      COUNT(employees.id) AS employeeCount
    FROM departments
    LEFT JOIN employees ON employees.departmentId = departments.id
    WHERE departments.id = ?
    GROUP BY departments.id
  `, [id]);
}

async function createDepartment(department) {
  const database = await getDatabase();

  const result = await database.run(`
    INSERT INTO departments
    (departmentName, managerName, description)
    VALUES (?, ?, ?)
  `, [
    department.departmentName,
    department.managerName,
    department.description || ""
  ]);

  return getDepartmentById(result.lastID);
}

async function updateDepartment(id, department) {
  const database = await getDatabase();

  await database.run(`
    UPDATE departments
    SET departmentName = ?,
        managerName = ?,
        description = ?
    WHERE id = ?
  `, [
    department.departmentName,
    department.managerName,
    department.description || "",
    id
  ]);

  return getDepartmentById(id);
}

async function deleteDepartment(id) {
  const database = await getDatabase();

  const result = await database.run(
    "DELETE FROM departments WHERE id = ?",
    [id]
  );

  return result.changes > 0;
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};