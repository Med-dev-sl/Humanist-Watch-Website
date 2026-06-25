import { prisma } from "@/lib/prisma";

export async function createAuditLog(params: {
  userId?: string;
  userEmail?: string;
  name?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}) {
  try {
    await prisma.auditLog.create({ data: params });
  } catch {
    // silently fail — audit should never break the main flow
  }
}
