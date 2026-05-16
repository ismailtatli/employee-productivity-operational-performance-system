const { getDatabase } = require("../config/database");

async function getAllMachines() {
  const database = await getDatabase();

  return database.all(`
    SELECT 
      production_machines.*,
      departments.departmentName
    FROM production_machines
    LEFT JOIN departments ON production_machines.departmentId = departments.id
    ORDER BY production_machines.id ASC
  `);
}

async function getMachineById(id) {
  const database = await getDatabase();

  return database.get(`
    SELECT 
      production_machines.*,
      departments.departmentName
    FROM production_machines
    LEFT JOIN departments ON production_machines.departmentId = departments.id
    WHERE production_machines.id = ?
  `, [id]);
}

async function createMachine(machine) {
  const database = await getDatabase();

  const result = await database.run(`
    INSERT INTO production_machines
    (machineCode, machineName, departmentId, status, capacityPerShift, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    machine.machineCode,
    machine.machineName,
    machine.departmentId,
    machine.status || "Active",
    machine.capacityPerShift,
    machine.description || ""
  ]);

  return getMachineById(result.lastID);
}

async function updateMachine(id, machine) {
  const database = await getDatabase();

  await database.run(`
    UPDATE production_machines
    SET machineCode = ?,
        machineName = ?,
        departmentId = ?,
        status = ?,
        capacityPerShift = ?,
        description = ?
    WHERE id = ?
  `, [
    machine.machineCode,
    machine.machineName,
    machine.departmentId,
    machine.status,
    machine.capacityPerShift,
    machine.description || "",
    id
  ]);

  return getMachineById(id);
}

async function deleteMachine(id) {
  const database = await getDatabase();

  const result = await database.run(
    "DELETE FROM production_machines WHERE id = ?",
    [id]
  );

  return result.changes > 0;
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};