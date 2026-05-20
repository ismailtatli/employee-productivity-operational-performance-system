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

function average(records, key) {
  if (!records.length) return 0;
  const total = records.reduce((sum, record) => sum + Number(record[key] || 0), 0);
  return roundToTwoDecimals(total / records.length);
}

function calculateAverages(records) {
  return {
    averagePerformanceScore: average(records, "overallPerformanceScore"),
    averageQualityScore: average(records, "qualityScore"),
    averageContinuityScore: average(records, "continuityScore")
  };
}

function getStandardDecision(score, qualityScore, continuityScore, onTimeScore) {
  if (score >= 92 && qualityScore >= 90 && continuityScore >= 88 && onTimeScore >= 88) {
    return "Outstanding Performer";
  }

  if (score >= 84 && qualityScore >= 82 && continuityScore >= 80) {
    return "High Performer";
  }

  if (score >= 70) {
    return "Stable Performer";
  }

  if (score >= 58) {
    return "Needs Improvement";
  }

  return "Critical Review Required";
}

function getStandardBand(score) {
  if (score >= 92) return "Excellent";
  if (score >= 84) return "Good";
  if (score >= 70) return "Stable";
  if (score >= 58) return "Needs Improvement";
  return "Critical";
}

function buildStandardReportSummary(profile) {
  const scoreText = `${profile.overallPerformanceScore}/100 overall, ${profile.qualityScore}/100 quality, ${profile.continuityScore}/100 continuity, and ${profile.onTimeCompletionScore}/100 on-time completion`;

  if (profile.decision === "Outstanding Performer") {
    return `${profile.fullName} from ${profile.departmentName} is performing above the factory standard with ${scoreText}. The employee is suitable for bonus review and may be considered for career development planning.`;
  }

  if (profile.decision === "High Performer") {
    return `${profile.fullName} from ${profile.departmentName} is a strong performer with ${scoreText}. The current performance level should be maintained and monitored for future bonus or promotion eligibility.`;
  }

  if (profile.decision === "Stable Performer") {
    return `${profile.fullName} from ${profile.departmentName} meets the expected factory performance standard with ${scoreText}. The employee should continue regular monitoring and receive targeted support where needed.`;
  }

  if (profile.decision === "Needs Improvement") {
    return `${profile.fullName} from ${profile.departmentName} is below the expected performance standard with ${scoreText}. A structured improvement plan should focus on production output, quality control, attendance, and time management.`;
  }

  return `${profile.fullName} from ${profile.departmentName} requires management attention with ${scoreText}. A formal HR and supervisor review is recommended before making any bonus or promotion decision.`;
}

function createEmployeeProfile(employee, records) {
  const enrichedRecords = records.map(enrichReportRecord);

  const totalTarget = enrichedRecords.reduce((sum, item) => sum + Number(item.targetQuantity || 0), 0);
  const totalActual = enrichedRecords.reduce((sum, item) => sum + Number(item.actualQuantity || 0), 0);
  const totalDefective = enrichedRecords.reduce((sum, item) => sum + Number(item.defectiveQuantity || 0), 0);
  const plannedWorkDays = enrichedRecords.reduce((sum, item) => sum + Number(item.plannedWorkDays || 0), 0);
  const absentDays = enrichedRecords.reduce((sum, item) => sum + Number(item.absentDays || 0), 0);
  const lateDays = enrichedRecords.reduce((sum, item) => sum + Number(item.lateDays || 0), 0);

  const overallPerformanceScore = average(enrichedRecords, "overallPerformanceScore");
  const qualityScore = average(enrichedRecords, "qualityScore");
  const continuityScore = average(enrichedRecords, "continuityScore");
  const onTimeCompletionScore = average(enrichedRecords, "onTimeCompletionScore");
  const targetCompletionScore = totalTarget > 0
    ? roundToTwoDecimals(Math.min((totalActual / totalTarget) * 100, 100))
    : 0;

  const performanceGrade = calculatePerformanceGrade(
    Math.max(0, Math.min(100, overallPerformanceScore))
  );

  const analysis = {
    overallPerformanceScore,
    qualityScore,
    continuityScore,
    onTimeCompletionScore
  };

  const bonusEligible = determineBonusEligibility(analysis);
  const recommendation = determineRecommendation(analysis);
  const decision = getStandardDecision(
    overallPerformanceScore,
    qualityScore,
    continuityScore,
    onTimeCompletionScore
  );

  const profile = {
    employeeId: employee.id,
    id: employee.id,
    fullName: employee.fullName,
    employeeName: employee.fullName,
    employeeCode: employee.employeeCode,
    position: employee.position,
    departmentId: employee.departmentId,
    departmentName: employee.departmentName || "-",
    status: employee.status,
    recordCount: enrichedRecords.length,
    totalTarget,
    totalActual,
    totalDefective,
    plannedWorkDays,
    absentDays,
    lateDays,
    targetCompletionScore,
    qualityScore,
    continuityScore,
    onTimeCompletionScore,
    overallPerformanceScore,
    performanceGrade,
    performanceBand: getStandardBand(overallPerformanceScore),
    decision,
    bonusEligible,
    recommendation,
    latestRecordDate: enrichedRecords[0]?.recordDate || null,
    records: enrichedRecords
  };

  return {
    ...profile,
    reportSummary: buildStandardReportSummary(profile)
  };
}

function groupRecordsByEmployee(records) {
  const grouped = new Map();

  for (const record of records) {
    const employeeId = Number(record.employeeId);
    if (!grouped.has(employeeId)) grouped.set(employeeId, []);
    grouped.get(employeeId).push(record);
  }

  return grouped;
}

async function getEmployeePerformanceReports(ownerUserId) {
  const [employees, rawRecords] = await Promise.all([
    reportRepository.getAllEmployeesForReports(ownerUserId),
    reportRepository.getAllProductionRecordsForReports(ownerUserId)
  ]);

  const groupedRecords = groupRecordsByEmployee(rawRecords);

  return employees
    .map((employee) => createEmployeeProfile(employee, groupedRecords.get(Number(employee.id)) || []))
    .sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
}

async function getSummaryReport(ownerUserId) {
  const employeeSummary = await reportRepository.getEmployeeSummary(ownerUserId);
  const productionSummary = await reportRepository.getProductionSummary(ownerUserId);
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  const averages = calculateAverages(employeeReports);

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
      bonusEligibleCount: employeeReports.filter((record) => record.bonusEligible).length,
      promotionCandidateCount: employeeReports.filter(
        (record) => record.recommendation === "Promotion Candidate"
      ).length,
      hrReviewRequiredCount: employeeReports.filter(
        (record) => record.recommendation === "HR Review Required"
      ).length
    }
  };
}

async function getEmployeeReports(ownerUserId) {
  return {
    data: await getEmployeePerformanceReports(ownerUserId)
  };
}

async function getTopPerformers(ownerUserId) {
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  return {
    data: employeeReports
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
      .slice(0, 10)
  };
}

async function getBonusEligibleEmployees(ownerUserId) {
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  return {
    data: employeeReports
      .filter((record) => record.bonusEligible)
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
  };
}

async function getPromotionCandidates(ownerUserId) {
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  return {
    data: employeeReports
      .filter((record) => record.recommendation === "Promotion Candidate")
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
  };
}

async function getLowContinuityEmployees(ownerUserId) {
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  return {
    data: employeeReports
      .filter((record) => Number(record.continuityScore) < 75)
      .sort((a, b) => a.continuityScore - b.continuityScore)
  };
}

async function getHrReviewRequired(ownerUserId) {
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  return {
    data: employeeReports
      .filter((record) => record.recommendation === "HR Review Required")
      .sort((a, b) => a.overallPerformanceScore - b.overallPerformanceScore)
  };
}

async function getDepartmentPerformance(ownerUserId) {
  const departments = await reportRepository.getDepartmentPerformance(ownerUserId);
  const employeeReports = await getEmployeePerformanceReports(ownerUserId);

  const enrichedDepartments = departments.map((department) => {
    const departmentReports = employeeReports.filter(
      (record) => Number(record.departmentId) === Number(department.departmentId)
    );

    const averages = calculateAverages(departmentReports);

    return {
      ...department,
      recordCount: Number(department.recordCount || 0),
      totalActualProduction: Number(department.totalActualProduction || 0),
      totalDefectiveQuantity: Number(department.totalDefectiveQuantity || 0),
      averageOnTimeCompletionScore: average(departmentReports, "onTimeCompletionScore"),
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
  getEmployeeReports,
  getTopPerformers,
  getBonusEligibleEmployees,
  getPromotionCandidates,
  getLowContinuityEmployees,
  getHrReviewRequired,
  getDepartmentPerformance
};
