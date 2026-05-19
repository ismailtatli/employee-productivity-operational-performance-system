const reportRepository = require("../repositories/reportRepository");

const {
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

function roundToTwoDecimals(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function enrichReportRecord(record) {
  const qualityScore = calculateQualityScore(
    Number(record.actualQuantity),
    Number(record.defectiveQuantity)
  );

  const continuityScore = calculateContinuityScore(
    Number(record.plannedWorkDays),
    Number(record.absentDays),
    Number(record.lateDays)
  );

  const overallPerformanceScore = calculateOverallPerformanceScore(record);
  const performanceGrade = calculatePerformanceGrade(overallPerformanceScore);

  const analysis = {
    overallPerformanceScore,
    qualityScore,
    continuityScore,
    onTimeCompletionScore: Number(record.onTimeCompletionScore)
  };

  const bonusEligible = determineBonusEligibility(analysis);
  const recommendation = determineRecommendation(analysis);

  const reportSummary = generateEmployeeReportSummary(
    record.fullName || record.employeeName || "The employee",
    record.departmentName || "the assigned department",
    {
      ...analysis,
      bonusEligible,
      recommendation
    }
  );

  return {
    ...record,
    qualityScore,
    continuityScore,
    overallPerformanceScore,
    performanceGrade,
    bonusEligible,
    recommendation,
    reportSummary
  };
}

function calculateAverages(records) {
  if (!records.length) {
    return {
      averagePerformanceScore: 0,
      averageQualityScore: 0,
      averageContinuityScore: 0
    };
  }

  const totalPerformance = records.reduce(
    (sum, record) => sum + Number(record.overallPerformanceScore || 0),
    0
  );

  const totalQuality = records.reduce(
    (sum, record) => sum + Number(record.qualityScore || 0),
    0
  );

  const totalContinuity = records.reduce(
    (sum, record) => sum + Number(record.continuityScore || 0),
    0
  );

  return {
    averagePerformanceScore: roundToTwoDecimals(totalPerformance / records.length),
    averageQualityScore: roundToTwoDecimals(totalQuality / records.length),
    averageContinuityScore: roundToTwoDecimals(totalContinuity / records.length)
  };
}

async function getSummaryReport(ownerUserId) {
  const employeeSummary = await reportRepository.getEmployeeSummary(ownerUserId);
  const productionSummary = await reportRepository.getProductionSummary(ownerUserId);
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);

  const records = rawRecords.map(enrichReportRecord);
  const averages = calculateAverages(records);

  return {
    data: {
      totalEmployees: Number(employeeSummary.totalEmployees || 0),
      activeEmployees: Number(employeeSummary.activeEmployees || 0),
      inactiveEmployees: Number(employeeSummary.inactiveEmployees || 0),
      totalProductionRecords: Number(productionSummary.totalProductionRecords || 0),
      totalActualProduction: Number(productionSummary.totalActualProduction || 0),
      totalDefectiveQuantity: Number(productionSummary.totalDefectiveQuantity || 0),
      averageOnTimeCompletionScore: roundToTwoDecimals(
        productionSummary.averageOnTimeCompletionScore || 0
      ),
      averagePerformanceScore: averages.averagePerformanceScore,
      averageQualityScore: averages.averageQualityScore,
      averageContinuityScore: averages.averageContinuityScore,
      bonusEligibleCount: records.filter((record) => record.bonusEligible).length,
      promotionCandidateCount: records.filter(
        (record) => record.recommendation === "Promotion Candidate"
      ).length,
      hrReviewRequiredCount: records.filter(
        (record) => record.recommendation === "HR Review Required"
      ).length
    }
  };
}

async function getTopPerformers(ownerUserId) {
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);

  return {
    data: rawRecords
      .map(enrichReportRecord)
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
      .slice(0, 10)
  };
}

async function getBonusEligibleEmployees(ownerUserId) {
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);

  return {
    data: rawRecords
      .map(enrichReportRecord)
      .filter((record) => record.bonusEligible)
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
  };
}

async function getPromotionCandidates(ownerUserId) {
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);

  return {
    data: rawRecords
      .map(enrichReportRecord)
      .filter((record) => record.recommendation === "Promotion Candidate")
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
  };
}

async function getLowContinuityEmployees(ownerUserId) {
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);

  return {
    data: rawRecords
      .map(enrichReportRecord)
      .filter((record) => Number(record.continuityScore) < 75)
      .sort((a, b) => a.continuityScore - b.continuityScore)
  };
}

async function getHrReviewRequired(ownerUserId) {
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);

  return {
    data: rawRecords
      .map(enrichReportRecord)
      .filter((record) => record.recommendation === "HR Review Required")
      .sort((a, b) => a.overallPerformanceScore - b.overallPerformanceScore)
  };
}

async function getDepartmentPerformance(ownerUserId) {
  const departments = await reportRepository.getDepartmentPerformance(ownerUserId);
  const rawRecords = await reportRepository.getAllProductionRecordsForReports(ownerUserId);
  const records = rawRecords.map(enrichReportRecord);

  const enrichedDepartments = departments.map((department) => {
    const departmentRecords = records.filter(
      (record) => Number(record.departmentId) === Number(department.departmentId)
    );

    const averages = calculateAverages(departmentRecords);

    return {
      ...department,
      recordCount: Number(department.recordCount || 0),
      totalActualProduction: Number(department.totalActualProduction || 0),
      totalDefectiveQuantity: Number(department.totalDefectiveQuantity || 0),
      averageOnTimeCompletionScore: roundToTwoDecimals(
        department.averageOnTimeCompletionScore || 0
      ),
      averagePerformanceScore: averages.averagePerformanceScore,
      averageQualityScore: averages.averageQualityScore,
      averageContinuityScore: averages.averageContinuityScore
    };
  });

  return {
    data: enrichedDepartments
  };
}

module.exports = {
  getSummaryReport,
  getTopPerformers,
  getBonusEligibleEmployees,
  getPromotionCandidates,
  getLowContinuityEmployees,
  getHrReviewRequired,
  getDepartmentPerformance
};
