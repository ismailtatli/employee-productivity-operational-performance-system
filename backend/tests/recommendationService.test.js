const {
  determineBonusEligibility,
  determineRecommendation,
  generateEmployeeReportSummary
} = require("../src/services/recommendationService");

describe("Recommendation Service", () => {
  test("marks employee as bonus eligible when score, quality and continuity are high", () => {
    const analysis = {
      overallPerformanceScore: 94,
      qualityScore: 95,
      continuityScore: 96
    };

    expect(determineBonusEligibility(analysis)).toBe(true);
  });

  test("does not mark employee as bonus eligible when continuity is low", () => {
    const analysis = {
      overallPerformanceScore: 94,
      qualityScore: 95,
      continuityScore: 70
    };

    expect(determineBonusEligibility(analysis)).toBe(false);
  });

  test("returns Promotion Candidate for excellent all-around performance", () => {
    const analysis = {
      overallPerformanceScore: 95,
      qualityScore: 94,
      continuityScore: 96,
      onTimeCompletionScore: 93
    };

    expect(determineRecommendation(analysis)).toBe("Promotion Candidate");
  });

  test("returns Monitor Closely for moderate performance", () => {
    const analysis = {
      overallPerformanceScore: 70,
      qualityScore: 80,
      continuityScore: 82,
      onTimeCompletionScore: 75
    };

    expect(determineRecommendation(analysis)).toBe("Monitor Closely");
  });

  test("returns Performance Improvement Plan Required for low performance", () => {
    const analysis = {
      overallPerformanceScore: 58,
      qualityScore: 65,
      continuityScore: 70,
      onTimeCompletionScore: 60
    };

    expect(determineRecommendation(analysis)).toBe("Performance Improvement Plan Required");
  });

  test("returns HR Review Required for critical performance indicators", () => {
    const analysis = {
      overallPerformanceScore: 45,
      qualityScore: 55,
      continuityScore: 60,
      onTimeCompletionScore: 50
    };

    expect(determineRecommendation(analysis)).toBe("HR Review Required");
  });

  test("generates report summary text", () => {
    const summary = generateEmployeeReportSummary("Elif Şahin", "Production", {
      overallPerformanceScore: 95,
      qualityScore: 94,
      continuityScore: 96,
      onTimeCompletionScore: 93,
      bonusEligible: true,
      recommendation: "Promotion Candidate"
    });

    expect(summary).toContain("Elif Şahin");
    expect(summary).toContain("Production");
    expect(summary).toContain("promotion candidate");
  });
});