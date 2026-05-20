const { getReadScopeUserId } = require("../utils/accessScope");
const reportService = require("../services/reportService");

async function getSummaryReport(req, res) {
  try {
    const result = await reportService.getSummaryReport(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve summary report."
    });
  }
}


async function getEmployeeReports(req, res) {
  try {
    const result = await reportService.getEmployeeReports(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve employee reports."
    });
  }
}

async function getTopPerformers(req, res) {
  try {
    const result = await reportService.getTopPerformers(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve top performers."
    });
  }
}

async function getBonusEligibleEmployees(req, res) {
  try {
    const result = await reportService.getBonusEligibleEmployees(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve bonus eligible employees."
    });
  }
}

async function getPromotionCandidates(req, res) {
  try {
    const result = await reportService.getPromotionCandidates(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve promotion candidates."
    });
  }
}

async function getLowContinuityEmployees(req, res) {
  try {
    const result = await reportService.getLowContinuityEmployees(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve low continuity employees."
    });
  }
}

async function getHrReviewRequired(req, res) {
  try {
    const result = await reportService.getHrReviewRequired(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve HR review required employees."
    });
  }
}

async function getDepartmentPerformance(req, res) {
  try {
    const result = await reportService.getDepartmentPerformance(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve department performance report."
    });
  }
}

module.exports = {
  // New names
  getSummaryReport,
  getEmployeeReports,
  getTopPerformers,
  getBonusEligibleEmployees,
  getPromotionCandidates,
  getLowContinuityEmployees,
  getHrReviewRequired,
  getDepartmentPerformance,

  // Backward-compatible names for existing reportRoutes.js
  getSummary: getSummaryReport,
  getBonusEligible: getBonusEligibleEmployees,
  getLowContinuity: getLowContinuityEmployees,
  getHRReviewRequired: getHrReviewRequired,
  getHrReview: getHrReviewRequired
};