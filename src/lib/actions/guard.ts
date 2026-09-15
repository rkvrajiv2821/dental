import { auth } from "@/lib/auth/auth";
import { assertCan, type Resource } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";

/** Verifies the current session is authorized for `resource`, throwing otherwise. Every admin mutation must call this first. */
export async function requireAccess(resource: Resource) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  assertCan(session.user.role as never, resource);
  return session.user;
}

export async function audit(action: string, entity: string, entityId?: string | null, metadata?: Record<string, unknown>) {
  const session = await auth();
  await logAudit({ userId: session?.user.id, action, entity, entityId, metadata });
}
