const { getDatabase } = require("../config/database");

function baseSelectQuery() {
  return `
    SELECT 
      production_records.*,
      employees.fullName,
      employees.employeeCode,
      employees.position,
      departments.departmentName
    FROM production_records
    LEFT JOIN employees ON production_records.employeeId = employees.id
    LEFT JOIN departments ON employees.departmentId = departments.id
  `;
}

async function getAllProductionRecords() {
  const database = await getDatabase();

  return database.all(`
    ${baseSelectQuery()}
    ORDER BY production_records.id ASC
  `);
}

async function getProductionRecordById(id) {
  const database = await getDatabase();

  return database.get(`
    ${baseSelectQuery()}
    WHERE production_records.id = ?
  `, [id]);
}

async function getProductionRecordsByEmployee(employeeId) {
  const database = await getDatabase();

  return database.all(`
    ${baseSelectQuery()}
    WHERE production_records.employeeId = ?
    ORDER BY production_records.recordDate DESC
  `, [employeeId]);
}

async function createProductionRecord(record) {
  const database = await getDatabase();

  const result = await database.run(`
    INSERT INTO production_records
    (employeeId, recordDate, period, productType, targetQuantity, actualQuantity, defectiveQuantity,
     onTimeCompletionScore, plannedWorkDays, absentDays, lateDays, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    record.employeeId,
    record.recordDate,
    record.period,
    record.productType,
    record.targetQuantity,
    record.actualQuantity,
    record.defectiveQuantity,
    record.onTimeCompletionScore,
    record.plannedWorkDays,
    record.absentDays,
    record.lateDays,
    record.notes || ""
  ]);

  return getProductionRecordById(result.lastID);
}

async function updateProductionRecord(id, record) {
  const database = await getDatabase();

  await database.run(`
    UPDATE production_records
    SET employeeId = ?,
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
    WHERE id = ?
  `, [
    record.employeeId,
    record.recordDate,
    record.period,
    record.productType,
    record.targetQuantity,
    record.actualQuantity,
    record.defectiveQuantity,
    record.onTimeCompletionScore,
    record.plannedWorkDays,
    record.absentDays,
    record.lateDays,
    record.notes || "",
    id
  ]);

  return getProductionRecordById(id);
}

async function deleteProductionRecord(id) {
  const database = await getDatabase();

  const result = await database.run(
    "DELETE FROM production_records WHERE id = ?",
    [id]
  );

  return result.changes > 0;
}

module.exports = {
  getAllProductionRecords,
  getProductionRecordById,
  getProductionRecordsByEmployee,
  createProductionRecord,
  updateProductionRecord,
  deleteProductionRecord
};