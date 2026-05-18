import AuditLog from "../models/AuditLog.js";

export function logAudit({ req, action, entity, entityId, oldValue, newValue }) {
  return AuditLog.create({
    actor: req.user._id,
    action,
    entity,
    entityId,
    oldValue,
    newValue,
    ip: req.ip,
  });
}
