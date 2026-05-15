const reportService = require("../services/reportService");

async function getSummaryReport(req, res, next) {
  try {
    const report = await reportService.getSummaryReport();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
}

async function getTopPerformers(req, res, next) {
  try {
    const report = await reportService.getTopPerformers();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
}

async function getBonusEligibleEmployees(req, res, next) {
  try {
    const report = await reportService.getBonusEligibleEmployees();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
}

async function getPromotionCandidates(req, res, next) {
  try {
    const report = await reportService.getPromotionCandidates();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
}

async function getLowContinuityEmployees(req, res, next) {
  try {
    const report = await reportService.getLowContinuityEmployees();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
}

async function getHrReviewRequiredEmployees(req, res, next) {
  try {
    const report = await reportService.getHrReviewRequiredEmployees();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
}

async function getDepartmentPerformanceReport(req, res, next) {
  try {
    const report = await reportService.getDepartmentPerformanceReport();

    res.status(200).json({
      data: report
    });
  } catch (error) {
    next(error);
  }
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