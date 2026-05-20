const { getDatabase } = require("../config/database");

function scopeWhere(ownerUserId, extra = []) {
  const clauses = ["production_machines.deletedAt IS NULL", ...extra];
  const params = [];
  if (ownerUserId !== null) {
    clauses.push("production_machines.ownerUserId = ?");
    params.push(ownerUserId);
  }
  return { sql: `WHERE ${clauses.join(" AND ")}`, params };
}

async function getAllMachines(ownerUserId) {
  const database = await getDatabase();
  const scope = scopeWhere(ownerUserId);
  return database.all(
    `SELECT production_machines.*, departments.departmentName
     FROM production_machines
     LEFT JOIN departments
       ON production_machines.departmentId = departments.id
      AND departments.deletedAt IS NULL
     ${scope.sql}
     ORDER BY production_machines.machineCode ASC`,
    scope.params
  );
}

async function getMachineById(id, ownerUserId) {
  const database = await getDatabase();
  const scope = scopeWhere(ownerUserId, ["production_machines.id = ?"]);
  return database.get(
    `SELECT production_machines.*, departments.departmentName
     FROM production_machines
     LEFT JOIN departments
       ON production_machines.departmentId = departments.id
      AND departments.deletedAt IS NULL
     ${scope.sql}`,
    [id, ...scope.params]
  );
}

async function createMachine(machineData, ownerUserId) {
  const database = await getDatabase();
  const result = await database.run(
    `INSERT INTO production_machines (ownerUserId, machineCode, machineName, departmentId, status, capacityPerShift, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [ownerUserId, machineData.machineCode, machineData.machineName, machineData.departmentId, machineData.status || "Active", machineData.capacityPerShift, machineData.description || ""]
  );
  return getMachineById(result.lastID, ownerUserId);
}

async function updateMachine(id, machineData, ownerUserId) {
  const database = await getDatabase();
  const where = ownerUserId === null
    ? "WHERE id = ? AND deletedAt IS NULL"
    : "WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL";
  const params = [machineData.machineCode, machineData.machineName, machineData.departmentId, machineData.status || "Active", machineData.capacityPerShift, machineData.description || "", id];
  if (ownerUserId !== null) params.push(ownerUserId);
  await database.run(`UPDATE production_machines SET machineCode = ?, machineName = ?, departmentId = ?, status = ?, capacityPerShift = ?, description = ? ${where}`, params);
  return getMachineById(id, ownerUserId);
}

async function deleteMachine(id, ownerUserId) {
  const database = await getDatabase();
  const machine = await getMachineById(id, ownerUserId);
  if (!machine) return null;
  if (ownerUserId === null) await database.run(`UPDATE production_machines SET status = 'Inactive', deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND deletedAt IS NULL`, id);
  else await database.run(`UPDATE production_machines SET status = 'Inactive', deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL`, [id, ownerUserId]);
  return machine;
}

module.exports = { getAllMachines, getMachineById, createMachine, updateMachine, deleteMachine };
