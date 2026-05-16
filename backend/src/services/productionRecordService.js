const productionRecordRepository = require("../repositories/productionRecordRepository");
const employeeRepository = require("../repositories/employeeRepository");
const { validateProductionRecordInput } = require("../validators/productionRecordValidator");
const { enrichProductionRecord } = require("./performanceCalculator");
const { enrichWithRecommendation } = require("./recommendationService");
const productRepository = require("../repositories/productRepository");
const machineRepository = require("../repositories/machineRepository");

function analyzeRecord(record) {
  const performanceAnalysis = enrichProductionRecord(record);
  return enrichWithRecommendation(performanceAnalysis);
}

function normalizeRecordInput(data) {
  return {
    employeeId: Number(data.employeeId),
    productId: Number(data.productId),
    machineId: Number(data.machineId),
    recordDate: data.recordDate,
    period: data.period,
    productType: data.productType,
    targetQuantity: Number(data.targetQuantity),
    actualQuantity: Number(data.actualQuantity),
    defectiveQuantity: Number(data.defectiveQuantity),
    onTimeCompletionScore: Number(data.onTimeCompletionScore),
    plannedWorkDays: Number(data.plannedWorkDays),
    absentDays: Number(data.absentDays),
    lateDays: Number(data.lateDays),
    notes: data.notes || ""
  };
}

async function getAllProductionRecords() {
  const records = await productionRecordRepository.getAllProductionRecords();
  return records.map(analyzeRecord);
}

async function getProductionRecordById(id) {
  const record = await productionRecordRepository.getProductionRecordById(id);

  if (!record) {
    const error = new Error("Production record not found.");
    error.statusCode = 404;
    throw error;
  }

  return analyzeRecord(record);
}

async function getProductionRecordsByEmployee(employeeId) {
  if (!employeeId || Number(employeeId) <= 0) {
    const error = new Error("Valid employee id is required.");
    error.statusCode = 400;
    throw error;
  }

  const employee = await employeeRepository.getEmployeeById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const records = await productionRecordRepository.getProductionRecordsByEmployee(employeeId);
  return records.map(analyzeRecord);
}

async function createProductionRecord(data) {
  const validation = validateProductionRecordInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const employee = await employeeRepository.getEmployeeById(data.employeeId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const product = await productRepository.getProductById(data.productId);

if (!product) {
  const error = new Error("Product not found.");
  error.statusCode = 404;
  throw error;
}

const machine = await machineRepository.getMachineById(data.machineId);

if (!machine) {
  const error = new Error("Production machine not found.");
  error.statusCode = 404;
  throw error;
}

  const created = await productionRecordRepository.createProductionRecord(
    normalizeRecordInput(data)
  );

  return analyzeRecord(created);
}

async function updateProductionRecord(id, data) {
  await getProductionRecordById(id);

  const validation = validateProductionRecordInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const employee = await employeeRepository.getEmployeeById(data.employeeId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const updated = await productionRecordRepository.updateProductionRecord(
    id,
    normalizeRecordInput(data)
  );

  return analyzeRecord(updated);
}

async function deleteProductionRecord(id) {
  await getProductionRecordById(id);

  const deleted = await productionRecordRepository.deleteProductionRecord(id);

  if (!deleted) {
    const error = new Error("Production record could not be deleted.");
    error.statusCode = 500;
    throw error;
  }

  return {
    message: "Production record deleted successfully."
  };
}

module.exports = {
  getAllProductionRecords,
  getProductionRecordById,
  getProductionRecordsByEmployee,
  createProductionRecord,
  updateProductionRecord,
  deleteProductionRecord
};