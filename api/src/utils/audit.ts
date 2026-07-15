import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logAudit(
  userId: string | null,
  action: string,
  tableName: string,
  recordId: string,
  oldValue: any = null,
  newValue: any = null,
  ipAddress: string | null = null
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        tableName,
        recordId,
        oldValue: oldValue ? (typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue)) : null,
        newValue: newValue ? (typeof newValue === 'string' ? newValue : JSON.stringify(newValue)) : null,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('[Audit Log Error]:', error);
  }
}
