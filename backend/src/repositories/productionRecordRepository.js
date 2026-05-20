const { getDatabase } = require("../config/database");

async function getAllProductionRecords(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT production_records.*,
            employees.fullName,
            employees.employeeCode,
            employees.position,
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
     ${ownerUserId === null ? "WHERE production_records.deletedAt IS NULL" : "WHERE production_records.deletedAt IS NULL AND production_records.ownerUserId = ?"}
     ORDER BY production_records.recordDate DESC, production_records.id DESC`,
    ownerUserId === null ? [] : [ownerUserId]
  );
}

async function getProductionRecordById(id, ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT production_records.*,
            employees.fullName,
            employees.employeeCode,
            employees.position,
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
     ${ownerUserId === null ? "WHERE production_records.id = ? AND production_records.deletedAt IS NULL" : "WHERE production_records.id = ? AND production_records.deletedAt IS NULL AND production_records.ownerUserId = ?"}`,
    ownerUserId === null ? [id] : [id, ownerUserId]
  );
}

async function getProductionRecordsByEmployee(employeeId, ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT production_records.*,
            employees.fullName,
            employees.employeeCode,
            employees.position,
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
     ${ownerUserId === null ? "WHERE production_records.employeeId = ? AND production_records.deletedAt IS NULL" : "WHERE production_records.employeeId = ? AND production_records.deletedAt IS NULL AND production_records.ownerUserId = ?"}
     ORDER BY production_records.recordDate DESC, production_records.id DESC`,
    ownerUserId === null ? [employeeId] : [employeeId, ownerUserId]
  );
}

async function createProductionRecord(recordData, ownerUserId) {
  const database = await getDatabase();

  const result = await database.run(
    `INSERT INTO production_records
     (ownerUserId, employeeId, productId, machineId, recordDate, period, productType,
      targetQuantity, actualQuantity, defectiveQuantity, onTimeCompletionScore,
      plannedWorkDays, absentDays, lateDays, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ownerUserId,
      recordData.employeeId,
      recordData.productId,
      recordData.machineId,
      recordData.recordDate,
      recordData.period,
      recordData.productType,
      recordData.targetQuantity,
      recordData.actualQuantity,
      recordData.defectiveQuantity,
      recordData.onTimeCompletionScore,
      recordData.plannedWorkDays,
      recordData.absentDays,
      recordData.lateDays,
      recordData.notes || ""
    ]
  );

  return getProductionRecordById(result.lastID, ownerUserId);
}

async function updateProductionRecord(id, recordData, ownerUserId) {
  const database = await getDatabase();

  await database.run(
    `UPDATE production_records
     SET employeeId = ?,
         productId = ?,
         machineId = ?,
         recordDate = ?,
         period = ?,
         productType = ?,
         targetQuantity = ?,
         actualQuantity = ?,
         defectiveQuantity = ?,
         onTimeCompletionScore = ?,
         plannedWorkDays = ?,
         absentDays = ?,
         lateDays = ?,
         notes = ?
     ${ownerUserId === null ? "WHERE id = ?" : "WHERE id = ? AND ownerUserId = ?"}`,
    [
      recordData.employeeId,
      recordData.productId,
      recordData.machineId,
      recordData.recordDate,
      recordData.period,
      recordData.productType,
      recordData.targetQuantity,
      recordData.actualQuantity,
      recordData.defectiveQuantity,
      recordData.onTimeCompletionScore,
      recordData.plannedWorkDays,
      recordData.absentDays,
      recordData.lateDays,
      recordData.notes || "",
      id
    ].concat(ownerUserId === null ? [] : [ownerUserId])
  );

  return getProductionRecordById(id, ownerUserId);
}

async function deleteProductionRecord(id, ownerUserId) {
  const database = await getDatabase();

  const record = await getProductionRecordById(id, ownerUserId);

  if (!record) {
    return null;
  }

  if (ownerUserId === null) {
    await database.run(`UPDATE production_records SET deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND deletedAt IS NULL`, id);
  } else {
    await database.run(
      `UPDATE production_records SET deletedAt = CURRENT_TIMESTAMP
       WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL`,
      [id, ownerUserId]
    );
  }

  return record;
}

module.exports = {
  getAllProductionRecords,
  getProductionRecordById,
  getProductionRecordsByEmployee,
  createProductionRecord,
  updateProductionRecord,
  deleteProductionRecord
};