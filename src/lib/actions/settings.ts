"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { siteSettingsSchema, seoSettingsSchema } from "@/lib/validations/settings";

export async function updateSiteSettings(input: unknown) {
  await requireAccess("settings");
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await prisma.siteSettings.create({ data: parsed.data });
  }
  await audit("update", "SiteSettings");
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, message: undefined as string | undefined };
}

export async function updateSeoSettings(input: unknown) {
  await requireAccess("seo");
  const parsed = seoSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };

  const existing = await prisma.sEOSettings.findFirst();
  if (existing) {
    await prisma.sEOSettings.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await prisma.sEOSettings.create({ data: parsed.data });
  }
  await audit("update", "SEOSettings");
  revalidatePath("/");
  revalidatePath("/admin/seo");
  return { success: true, message: undefined as string | undefined };
}
