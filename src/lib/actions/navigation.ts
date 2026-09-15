"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { navigationSchema } from "@/lib/validations/settings";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/navigation");
}

export async function createNavItem(input: unknown) {
  await requireAccess("navigation");
  const parsed = navigationSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const item = await prisma.navigation.create({ data: parsed.data });
  await audit("create", "Navigation", item.id);
  revalidate();
  return { success: true, id: item.id };
}

export async function updateNavItem(id: string, input: unknown) {
  await requireAccess("navigation");
  const parsed = navigationSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.navigation.update({ where: { id }, data: parsed.data });
  await audit("update", "Navigation", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteNavItem(id: string) {
  await requireAccess("navigation");
  await prisma.navigation.delete({ where: { id } });
  await audit("delete", "Navigation", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function reorderNavItems(orderedIds: string[]) {
  await requireAccess("navigation");
  await prisma.$transaction(orderedIds.map((id, index) => prisma.navigation.update({ where: { id }, data: { order: index } })));
  revalidate();
  return { success: true, message: undefined as string | undefined };
}
