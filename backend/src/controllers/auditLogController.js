const auditLogService = require("../services/auditLogService");

async function getAuditLogs(req, res) {
  try {
    const result = await auditLogService.getAuditLogs(req.query || {});
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve audit logs."
    });
  }
}

module.exports = {
  getAuditLogs
};
