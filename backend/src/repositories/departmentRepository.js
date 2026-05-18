const { getDatabase } = require("../config/database");

async function getAllDepartments(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT departments.*,
            COUNT(employees.id) AS employeeCount
     FROM departments
     LEFT JOIN employees
       ON departments.id = employees.departmentId
      AND employees.ownerUserId = departments.ownerUserId
     WHERE departments.ownerUserId = ?
     GROUP BY departments.id
     ORDER BY departments.departmentName ASC`,
    ownerUserId
  );
}

async function getDepartmentById(id, ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT departments.*,
            COUNT(employees.id) AS employeeCount
     FROM departments
     LEFT JOIN employees
       ON departments.id = employees.departmentId
      AND employees.ownerUserId = departments.ownerUserId
     WHERE departments.id = ?
       AND departments.ownerUserId = ?
     GROUP BY departments.id`,
    [id, ownerUserId]
  );
}

async function createDepartment(departmentData, ownerUserId) {
  const database = await getDatabase();

  const result = await database.run(
    `INSERT INTO departments
     (ownerUserId, departmentName, managerName, description)
     VALUES (?, ?, ?, ?)`,
    [
      ownerUserId,
      departmentData.departmentName,
      departmentData.managerName,
      departmentData.description || ""
    ]
  );

  return getDepartmentById(result.lastID, ownerUserId);
}

async function updateDepartment(id, departmentData, ownerUserId) {
  const database = await getDatabase();

  await database.run(
    `UPDATE departments
     SET departmentName = ?,
         managerName = ?,
         description = ?
     WHERE id = ? AND ownerUserId = ?`,
    [
      departmentData.departmentName,
      departmentData.managerName,
      departmentData.description || "",
      id,
      ownerUserId
    ]
  );

  return getDepartmentById(id, ownerUserId);
}

async function deleteDepartment(id, ownerUserId) {
  const database = await getDatabase();

  const department = await getDepartmentById(id, ownerUserId);

  if (!department) {
    return null;
  }

  await database.run(
    `DELETE FROM departments
     WHERE id = ? AND ownerUserId = ?`,
    [id, ownerUserId]
  );

  return department;
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};