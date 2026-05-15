function determineBonusEligibility(analysis) {
  return (
    analysis.overallPerformanceScore >= 90 &&
    analysis.qualityScore >= 90 &&
    analysis.continuityScore >= 90
  );
}

function determineRecommendation(analysis) {
  const {
    overallPerformanceScore,
    qualityScore,
    continuityScore,
    onTimeCompletionScore
  } = analysis;

  if (
    overallPerformanceScore < 50 ||
    qualityScore < 50 ||
    continuityScore < 50
  ) {
    return "HR Review Required";
  }

  if (
    overallPerformanceScore < 60 ||
    qualityScore < 60 ||
    continuityScore < 60
  ) {
    return "Performance Improvement Plan Required";
  }

  if (
    overallPerformanceScore >= 92 &&
    qualityScore >= 90 &&
    continuityScore >= 90 &&
    onTimeCompletionScore >= 90
  ) {
    return "Promotion Candidate";
  }

  if (
    overallPerformanceScore >= 60 &&
    overallPerformanceScore < 75
  ) {
    return "Monitor Closely";
  }

  if (qualityScore < 75 || continuityScore < 75) {
    return "Monitor Closely";
  }

  return "Stable Performer";
}

function generateEmployeeReportSummary(employeeName, departmentName, analysis) {
  const bonusText = analysis.bonusEligible
    ? "The employee is eligible for a performance bonus."
    : "The employee is not eligible for a performance bonus in the current evaluation period.";

  if (analysis.recommendation === "Promotion Candidate") {
    return `${employeeName} from ${departmentName} exceeded the expected operational performance level with strong quality, continuity, and on-time completion indicators. ${bonusText} The employee may be considered as a promotion candidate.`;
  }

  if (analysis.recommendation === "HR Review Required") {
    return `${employeeName} from ${departmentName} shows critical operational performance indicators. A formal HR review is recommended before any administrative decision. ${bonusText}`;
  }

  if (analysis.recommendation === "Performance Improvement Plan Required") {
    return `${employeeName} from ${departmentName} remained below the expected operational performance level. A structured performance improvement plan is recommended. ${bonusText}`;
  }

  if (analysis.recommendation === "Monitor Closely") {
    return `${employeeName} from ${departmentName} shows moderate performance with indicators that should be monitored in the next evaluation period. ${bonusText}`;
  }

  return `${employeeName} from ${departmentName} shows stable operational performance based on the current production, quality, on-time completion, and continuity indicators. ${bonusText}`;
}

function enrichWithRecommendation(record) {
  const analysis = {
    overallPerformanceScore: record.overallPerformanceScore,
    qualityScore: record.qualityScore,
    continuityScore: record.continuityScore,
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
    bonusEligible,
    recommendation,
    reportSummary
  };
}

module.exports = {
  determineBonusEligibility,
  determineRecommendation,
  generateEmployeeReportSummary,
  enrichWithRecommendation
};