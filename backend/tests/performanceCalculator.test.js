const {
  calculateTargetCompletionScore,
  calculateQualityScore,
  calculateContinuityScore,
  calculateOverallPerformanceScore,
  calculatePerformanceGrade
} = require("../src/services/performanceCalculator");

describe("Performance Calculator", () => {
  test("calculates target completion score correctly", () => {
    expect(calculateTargetCompletionScore(465, 500)).toBe(93);
  });

  test("caps target completion score at 100", () => {
    expect(calculateTargetCompletionScore(620, 600)).toBe(100);
  });

  test("calculates quality score correctly", () => {
    expect(calculateQualityScore(465, 12)).toBe(97.42);
  });

  test("calculates continuity score correctly", () => {
    expect(calculateContinuityScore(22, 1, 2)).toBe(90.91);
  });

  test("calculates overall performance score correctly", () => {
    const record = {
      targetQuantity: 500,
      actualQuantity: 465,
      defectiveQuantity: 12,
      onTimeCompletionScore: 90,
      plannedWorkDays: 22,
      absentDays: 1,
      lateDays: 2
    };

    expect(calculateOverallPerformanceScore(record)).toBe(93.09);
  });

  test("returns Excellent grade for score greater than or equal to 90", () => {
    expect(calculatePerformanceGrade(93.09)).toBe("Excellent");
  });

  test("returns Good grade for score between 75 and 89", () => {
    expect(calculatePerformanceGrade(82)).toBe("Good");
  });

  test("returns Needs Improvement grade for score between 60 and 74", () => {
    expect(calculatePerformanceGrade(68)).toBe("Needs Improvement");
  });

  test("returns Poor grade for score below 60", () => {
    expect(calculatePerformanceGrade(55)).toBe("Poor");
  });

  test("throws error when target quantity is zero", () => {
    expect(() => calculateTargetCompletionScore(100, 0)).toThrow();
  });

  test("throws error when defective quantity is greater than actual quantity", () => {
    expect(() => calculateQualityScore(100, 120)).toThrow();
  });

  test("throws error when absent days are greater than planned work days", () => {
    expect(() => calculateContinuityScore(20, 25, 0)).toThrow();
  });
});