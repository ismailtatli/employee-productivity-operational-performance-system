function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}

function calculateTargetCompletionScore(actualQuantity, targetQuantity) {
  if (targetQuantity <= 0) {
    throw new Error("Target quantity must be greater than zero.");
  }

  if (actualQuantity < 0) {
    throw new Error("Actual quantity cannot be negative.");
  }

  const score = (actualQuantity / targetQuantity) * 100;
  return roundToTwoDecimals(Math.min(score, 100));
}

function calculateQualityScore(actualQuantity, defectiveQuantity) {
  if (actualQuantity <= 0) {
    throw new Error("Actual quantity must be greater than zero.");
  }

  if (defectiveQuantity < 0) {
    throw new Error("Defective quantity cannot be negative.");
  }

  if (defectiveQuantity > actualQuantity) {
    throw new Error("Defective quantity cannot be greater than actual quantity.");
  }

  const defectRate = (defectiveQuantity / actualQuantity) * 100;
  return roundToTwoDecimals(100 - defectRate);
}

function calculateContinuityScore(plannedWorkDays, absentDays, lateDays) {
  if (plannedWorkDays <= 0) {
    throw new Error("Planned work days must be greater than zero.");
  }

  if (absentDays < 0 || lateDays < 0) {
    throw new Error("Absent days and late days cannot be negative.");
  }

  if (absentDays > plannedWorkDays) {
    throw new Error("Absent days cannot be greater than planned work days.");
  }

  const effectiveAbsence = absentDays + lateDays * 0.5;
  const score = ((plannedWorkDays - effectiveAbsence) / plannedWorkDays) * 100;

  return roundToTwoDecimals(Math.max(score, 0));
}

function validateOnTimeCompletionScore(onTimeCompletionScore) {
  const score = Number(onTimeCompletionScore);

  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error("On-time completion score must be between 0 and 100.");
  }

  return score;
}

function calculateOverallPerformanceScore(record) {
  const targetCompletionScore = calculateTargetCompletionScore(
    Number(record.actualQuantity),
    Number(record.targetQuantity)
  );

  const qualityScore = calculateQualityScore(
    Number(record.actualQuantity),
    Number(record.defectiveQuantity)
  );

  const continuityScore = calculateContinuityScore(
    Number(record.plannedWorkDays),
    Number(record.absentDays),
    Number(record.lateDays)
  );

  const onTimeCompletionScore = validateOnTimeCompletionScore(record.onTimeCompletionScore);

  const overallScore =
    targetCompletionScore * 0.35 +
    qualityScore * 0.25 +
    onTimeCompletionScore * 0.20 +
    continuityScore * 0.20;

  return roundToTwoDecimals(overallScore);
}

function calculatePerformanceGrade(overallScore) {
  const score = Number(overallScore);

  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error("Overall score must be between 0 and 100.");
  }

  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Improvement";
  return "Poor";
}

function enrichProductionRecord(record) {
  const targetCompletionScore = calculateTargetCompletionScore(
    Number(record.actualQuantity),
    Number(record.targetQuantity)
  );

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

  return {
    ...record,
    targetCompletionScore,
    qualityScore,
    continuityScore,
    overallPerformanceScore,
    performanceGrade
  };
}

module.exports = {
  roundToTwoDecimals,
  calculateTargetCompletionScore,
  calculateQualityScore,
  calculateContinuityScore,
  validateOnTimeCompletionScore,
  calculateOverallPerformanceScore,
  calculatePerformanceGrade,
  enrichProductionRecord
};