const productionRecordRepository = require("../repositories/productionRecordRepository");
const employeeRepository = require("../repositories/employeeRepository");
const productRepository = require("../repositories/productRepository");
const machineRepository = require("../repositories/machineRepository");
const { validateProductionRecordInput } = require("../validators/productionRecordValidator");

const {
  calculateTargetCompletionScore,
  calculateQualityScore,
  calculateContinuityScore,
  calculateOverallPerformanceScore,
  calculatePerformanceGrade
} = require("./performanceCalculator");

const {
  determineBonusEligibility,
  determineRecommendation,
  generateEmployeeReportSummary
} = require("./recommendationService");

function enrichProductionRecord(record) {
  const targetCompletionScore = calculateTargetCompletionScore(record);
  const qualityScore = calculateQualityScore(record);
  const continuityScore = calculateContinuityScore(record);
  const overallPerformanceScore = calculateOverallPerformanceScore(record);
  const performanceGrade = calculatePerformanceGrade(overallPerformanceScore);

  const enrichedRecord = {
    ...record,
    targetCompletionScore,
    qualityScore,
    continuityScore,
    overallPerformanceScore,
    performanceGrade
  };

  const bonusEligible = determineBonusEligibility(enrichedRecord);
  const recommendation = determineRecommendation(enrichedRecord);
  const reportSummary = generateEmployeeReportSummary(
    enrichedRecord.fullName || enrichedRecord.employeeName || "The employee",
    enrichedRecord.departmentName || "the assigned department",
    {
      overallPerformanceScore: enrichedRecord.overallPerformanceScore,
      qualityScore: enrichedRecord.qualityScore,
      continuityScore: enrichedRecord.continuityScore,
      onTimeCompletionScore: Number(enrichedRecord.onTimeCompletionScore),
      bonusEligible,
      recommendation
    }
  );

  return {
    ...enrichedRecord,
    bonusEligible,
    recommendation,
    reportSummary
  };
}

async function getAllProductionRecords(ownerUserId) {
  const records = await productionRecordRepository.getAllProductionRecords(ownerUserId);

  return {
    data: records.map(enrichProductionRecord)
  };
}

async function getProductionRecordById(id, ownerUserId) {
  const record = await productionRecordRepository.getProductionRecordById(id, ownerUserId);

  if (!record) {
    const error = new Error("Production record not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    data: enrichProductionRecord(record)
  };
}

async function getProductionRecordsByEmployee(employeeId, ownerUserId) {
  const employee = await employeeRepository.getEmployeeById(employeeId, ownerUserId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const records = await productionRecordRepository.getProductionRecordsByEmployee(
    employeeId,
    ownerUserId
  );

  return {
    data: records.map(enrichProductionRecord)
  };
}

async function validateRelatedEntities(recordData, ownerUserId) {
  const employee = await employeeRepository.getEmployeeById(recordData.employeeId, ownerUserId);

  if (!employee) {
    const error = new Error("Employee not found for this user.");
    error.statusCode = 404;
    throw error;
  }

  const product = await productRepository.getProductById(recordData.productId, ownerUserId);

  if (!product) {
    const error = new Error("Product not found for this user.");
    error.statusCode = 404;
    throw error;
  }

  const machine = await machineRepository.getMachineById(recordData.machineId, ownerUserId);

  if (!machine) {
    const error = new Error("Production machine not found for this user.");
    error.statusCode = 404;
    throw error;
  }
}

async function createProductionRecord(recordData, ownerUserId) {
  const validation = validateProductionRecordInput(recordData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  await validateRelatedEntities(recordData, ownerUserId);

  const record = await productionRecordRepository.createProductionRecord(recordData, ownerUserId);

  return {
    message: "Production record created successfully.",
    data: enrichProductionRecord(record)
  };
}

async function updateProductionRecord(id, recordData, ownerUserId) {
  const validation = validateProductionRecordInput(recordData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingRecord = await productionRecordRepository.getProductionRecordById(id, ownerUserId);

  if (!existingRecord) {
    const error = new Error("Production record not found.");
    error.statusCode = 404;
    throw error;
  }

  await validateRelatedEntities(recordData, ownerUserId);

  const record = await productionRecordRepository.updateProductionRecord(
    id,
    recordData,
    ownerUserId
  );

  return {
    message: "Production record updated successfully.",
    data: enrichProductionRecord(record)
  };
}

async function deleteProductionRecord(id, ownerUserId) {
  const record = await productionRecordRepository.deleteProductionRecord(id, ownerUserId);

  if (!record) {
    const error = new Error("Production record not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "Production record deleted successfully.",
    data: enrichProductionRecord(record)
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