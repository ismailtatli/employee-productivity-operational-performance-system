const reportService = require("../services/reportService");

async function getSummaryReport(req, res) {
  try {
    const result = await reportService.getSummaryReport(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve summary report."
    });
  }
}

async function getTopPerformers(req, res) {
  try {
    const result = await reportService.getTopPerformers(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve top performers."
    });
  }
}

async function getBonusEligibleEmployees(req, res) {
  try {
    const result = await reportService.getBonusEligibleEmployees(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve bonus eligible employees."
    });
  }
}

async function getPromotionCandidates(req, res) {
  try {
    const result = await reportService.getPromotionCandidates(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve promotion candidates."
    });
  }
}

async function getLowContinuityEmployees(req, res) {
  try {
    const result = await reportService.getLowContinuityEmployees(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve low continuity employees."
    });
  }
}

async function getHrReviewRequired(req, res) {
  try {
    const result = await reportService.getHrReviewRequired(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve HR review required employees."
    });
  }
}

async function getDepartmentPerformance(req, res) {
  try {
    const result = await reportService.getDepartmentPerformance(req.user.id);
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