const productionRecordService = require("./productionRecordService");
const employeeRepository = require("../repositories/employeeRepository");
const departmentRepository = require("../repositories/departmentRepository");

function average(values) {
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + Number(value), 0);
  return Math.round((total / values.length) * 100) / 100;
}

async function getSummaryReport() {
  const employees = await employeeRepository.getAllEmployees();
  const departments = await departmentRepository.getAllDepartments();
  const records = await productionRecordService.getAllProductionRecords();

  const activeEmployees = employees.filter((employee) => employee.status === "Active");

  return {
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    totalDepartments: departments.length,
    totalProductionRecords: records.length,
    totalActualProduction: records.reduce((sum, record) => sum + Number(record.actualQuantity), 0),
    averagePerformanceScore: average(records.map((record) => record.overallPerformanceScore)),
    averageQualityScore: average(records.map((record) => record.qualityScore)),
    averageContinuityScore: average(records.map((record) => record.continuityScore)),
    bonusEligibleCount: records.filter((record) => record.bonusEligible).length,
    promotionCandidateCount: records.filter((record) => record.recommendation === "Promotion Candidate").length,
    monitorCloselyCount: records.filter((record) => record.recommendation === "Monitor Closely").length,
    hrReviewRequiredCount: records.filter((record) => record.recommendation === "HR Review Required").length
  };
}

async function getTopPerformers() {
  const records = await productionRecordService.getAllProductionRecords();

  return records
    .filter((record) => record.overallPerformanceScore >= 75)
    .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
    .slice(0, 5);
}

async function getBonusEligibleEmployees() {
  const records = await productionRecordService.getAllProductionRecords();

  return records
    .filter((record) => record.bonusEligible)
    .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore);
}

async function getPromotionCandidates() {
  const records = await productionRecordService.getAllProductionRecords();

  return records
    .filter((record) => record.recommendation === "Promotion Candidate")
    .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore);
}

async function getLowContinuityEmployees() {
  const records = await productionRecordService.getAllProductionRecords();

  return records
    .filter((record) => record.continuityScore < 75)
    .sort((a, b) => a.continuityScore - b.continuityScore);
}

async function getHrReviewRequiredEmployees() {
  const records = await productionRecordService.getAllProductionRecords();

  return records
    .filter((record) => record.recommendation === "HR Review Required")
    .sort((a, b) => a.overallPerformanceScore - b.overallPerformanceScore);
}

async function getDepartmentPerformanceReport() {
  const records = await productionRecordService.getAllProductionRecords();

  const grouped = {};

  for (const record of records) {
    const departmentName = record.departmentName || "Unassigned";

    if (!grouped[departmentName]) {
      grouped[departmentName] = {
        departmentName,
        recordCount: 0,
        totalActualProduction: 0,
        performanceScores: [],
        qualityScores: [],
        continuityScores: []
      };
    }

    grouped[departmentName].recordCount += 1;
    grouped[departmentName].totalActualProduction += Number(record.actualQuantity);
    grouped[departmentName].performanceScores.push(record.overallPerformanceScore);
    grouped[departmentName].qualityScores.push(record.qualityScore);
    grouped[departmentName].continuityScores.push(record.continuityScore);
  }

  return Object.values(grouped)
    .map((department) => ({
      departmentName: department.departmentName,
      recordCount: department.recordCount,
      totalActualProduction: department.totalActualProduction,
      averagePerformanceScore: average(department.performanceScores),
      averageQualityScore: average(department.qualityScores),
      averageContinuityScore: average(department.continuityScores)
    }))
    .sort((a, b) => b.averagePerformanceScore - a.averagePerformanceScore);
}

module.exports = {
  getSummaryReport,
  getTopPerformers,
  getBonusEligibleEmployees,
  getPromotionCandidates,
  getLowContinuityEmployees,
  getHrReviewRequiredEmployees,
  getDepartmentPerformanceReport
};