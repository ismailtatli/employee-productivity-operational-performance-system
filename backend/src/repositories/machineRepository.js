const { getDatabase } = require("../config/database");

async function getAllMachines(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT production_machines.*, departments.departmentName
     FROM production_machines
     LEFT JOIN departments ON production_machines.departmentId = departments.id
     WHERE production_machines.ownerUserId = ?
     ORDER BY production_machines.machineCode ASC`,
    ownerUserId
  );
}

async function getMachineById(id, ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT production_machines.*, departments.departmentName
     FROM production_machines
     LEFT JOIN departments ON production_machines.departmentId = departments.id
     WHERE production_machines.id = ?
       AND production_machines.ownerUserId = ?`,
    [id, ownerUserId]
  );
}

async function createMachine(machineData, ownerUserId) {
  const database = await getDatabase();

  const result = await database.run(
    `INSERT INTO production_machines
    (ownerUserId, machineCode, machineName, departmentId, status, capacityPerShift, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ownerUserId,
      machineData.machineCode,
      machineData.machineName,
      machineData.departmentId,
      machineData.status || "Active",
      machineData.capacityPerShift,
      machineData.description || ""
    ]
  );

  return getMachineById(result.lastID, ownerUserId);
}

async function updateMachine(id, machineData, ownerUserId) {
  const database = await getDatabase();

  await database.run(
    `UPDATE production_machines
     SET machineCode = ?,
         machineName = ?,
         departmentId = ?,
         status = ?,
         capacityPerShift = ?,
         description = ?
     WHERE id = ? AND ownerUserId = ?`,
    [
      machineData.machineCode,
      machineData.machineName,
      machineData.departmentId,
      machineData.status || "Active",
      machineData.capacityPerShift,
      machineData.description || "",
      id,
      ownerUserId
    ]
  );

  return getMachineById(id, ownerUserId);
}

async function deleteMachine(id, ownerUserId) {
  const database = await getDatabase();

  const machine = await getMachineById(id, ownerUserId);

  if (!machine) {
    return null;
  }

  await database.run(
    `DELETE FROM production_machines
     WHERE id = ? AND ownerUserId = ?`,
    [id, ownerUserId]
  );

  return machine;
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};