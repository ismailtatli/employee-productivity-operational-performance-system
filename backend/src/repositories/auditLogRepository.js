const { getDatabase } = require("../config/database");

async function createAuditLog(entry) {
  const database = await getDatabase();

  await database.run(
    `INSERT INTO audit_logs
     (userId, userEmail, userRole, action, entity, entityId, method, path, statusCode, details, ipAddress)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.userId || null,
      entry.userEmail || null,
      entry.userRole || null,
      entry.action || "UNKNOWN",
      entry.entity || "system",
      entry.entityId || null,
      entry.method || null,
      entry.path || null,
      entry.statusCode || null,
      entry.details ? JSON.stringify(entry.details).slice(0, 2000) : null,
      entry.ipAddress || null
    ]
  );
}

async function getAuditLogs(filters = {}) {
  const database = await getDatabase();
  const where = [];
  const params = [];

  if (filters.action) {
    where.push("action = ?");
    params.push(filters.action);
  }

  if (filters.entity) {
    where.push("entity = ?");
    params.push(filters.entity);
  }

  if (filters.userRole) {
    where.push("userRole = ?");
    params.push(filters.userRole);
  }

  const limit = Math.min(Math.max(Number(filters.limit) || 100, 1), 500);

  return database.all(
    `SELECT *
     FROM audit_logs
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY createdAt DESC, id DESC
     LIMIT ?`,
    [...params, limit]
  );
}

module.exports = {
  createAuditLog,
  getAuditLogs
};
