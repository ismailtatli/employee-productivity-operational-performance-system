const auditLogRepository = require("../repositories/auditLogRepository");

async function getAuditLogs(filters) {
  const logs = await auditLogRepository.getAuditLogs(filters);

  return {
    data: logs
  };
}

module.exports = {
  getAuditLogs
};
