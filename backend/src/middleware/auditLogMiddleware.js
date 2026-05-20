const auditLogRepository = require("../repositories/auditLogRepository");

function getAction(method, path) {
  if (path.includes("/auth/login")) return "LOGIN";
  if (path.includes("/auth/register")) return "REGISTER";
  if (method === "POST") return "CREATE";
  if (method === "PUT" || method === "PATCH") return "UPDATE";
  if (method === "DELETE") return "SOFT_DELETE";
  return "READ";
}

function getEntity(path) {
  if (path.includes("/auth/login")) return "auth";
  if (path.includes("/auth/register")) return "user";
  if (path.includes("/employees")) return "employee";
  if (path.includes("/departments")) return "department";
  if (path.includes("/products")) return "product";
  if (path.includes("/machines")) return "machine";
  if (path.includes("/production-records")) return "production_record";
  if (path.includes("/reports")) return "report";
  if (path.includes("/audit-logs")) return "audit_log";
  return "system";
}

function extractEntityId(path) {
  const match = path.match(/\/(employees|departments|products|machines|production-records)\/(\d+)/);
  return match ? Number(match[2]) : null;
}

function sanitizeBody(body) {
  if (!body || typeof body !== "object") return null;
  const copy = { ...body };
  delete copy.password;
  delete copy.passwordHash;
  delete copy.confirmPassword;
  return copy;
}

function auditLogMiddleware(req, res, next) {
  const shouldLog = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (!shouldLog) {
    return next();
  }

  res.on("finish", async () => {
    if (res.statusCode >= 400) return;

    try {
      await auditLogRepository.createAuditLog({
        userId: req.user ? req.user.id : null,
        userEmail: req.user ? req.user.email : req.body?.email || null,
        userRole: req.user ? req.user.role : null,
        action: getAction(req.method, req.originalUrl),
        entity: getEntity(req.originalUrl),
        entityId: extractEntityId(req.originalUrl),
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        details: sanitizeBody(req.body),
        ipAddress: req.ip
      });
    } catch (error) {
      console.error("Audit log failed:", error.message);
    }
  });

  next();
}

module.exports = {
  auditLogMiddleware
};
