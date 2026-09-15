import { prisma } from "@/lib/db/prisma";

export async function logAudit(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        metadata: params.metadata ?? undefined,
      },
    });
  } catch {
    // Audit logging must never break the calling mutation.
  }
}
