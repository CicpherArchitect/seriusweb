import winston from 'winston';
import 'winston-daily-rotate-file';
import prisma from './prisma.js';

const auditTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/audit-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: process.env.AUDIT_LOG_RETENTION_DAYS || '365d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

const auditLogger = winston.createLogger({
  transports: [auditTransport]
});

interface AuditLogParams {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: string;
  req: {
    ip: string;
    headers: {
      'user-agent': string;
    };
  };
  incidentId?: string;
  evidenceId?: string;
}

export const logAudit = async ({
  action,
  entityType,
  entityId,
  userId,
  details,
  req,
  incidentId,
  evidenceId
}: AuditLogParams) => {
  // Log to file system
  auditLogger.info({
    timestamp: new Date(),
    action,
    entityType,
    entityId,
    userId,
    details,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Log to database
  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      userId,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown',
      incidentId,
      evidenceId
    }
  });
};