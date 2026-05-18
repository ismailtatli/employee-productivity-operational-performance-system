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
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.ownerUserId = production_records.ownerUserId
     LEFT JOIN products
       ON production_records.productId = products.id
      AND products.ownerUserId = production_records.ownerUserId
     LEFT JOIN production_machines
       ON production_records.machineId = production_machines.id
      AND production_machines.ownerUserId = production_records.ownerUserId
     WHERE production_records.ownerUserId = ?
     ORDER BY production_records.recordDate DESC, production_records.id DESC`,
    ownerUserId
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
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.ownerUserId = production_records.ownerUserId
     LEFT JOIN products
       ON production_records.productId = products.id
      AND products.ownerUserId = production_records.ownerUserId
     LEFT JOIN production_machines
       ON production_records.machineId = production_machines.id
      AND production_machines.ownerUserId = production_records.ownerUserId
     WHERE production_records.id = ?
       AND production_records.ownerUserId = ?`,
    [id, ownerUserId]
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
     LEFT JOIN departments
       ON employees.departmentId = departments.id
      AND departments.ownerUserId = production_records.ownerUserId
     LEFT JOIN products
       ON production_records.productId = products.id
      AND products.ownerUserId = production_records.ownerUserId
     LEFT JOIN production_machines
       ON production_records.machineId = production_machines.id
      AND production_machines.ownerUserId = production_records.ownerUserId
     WHERE production_records.employeeId = ?
       AND production_records.ownerUserId = ?
     ORDER BY production_records.recordDate DESC, production_records.id DESC`,
    [employeeId, ownerUserId]
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
     WHERE id = ? AND ownerUserId = ?`,
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
      id,
      ownerUserId
    ]
  );

  return getProductionRecordById(id, ownerUserId);
}

async function deleteProductionRecord(id, ownerUserId) {
  const database = await getDatabase();

  const record = await getProductionRecordById(id, ownerUserId);

  if (!record) {
    return null;
  }

  await database.run(
    `DELETE FROM production_records
     WHERE id = ? AND ownerUserId = ?`,
    [id, ownerUserId]
  );

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