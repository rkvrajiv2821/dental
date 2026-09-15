"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { gallerySchema, galleryCategorySchema, smileCaseSchema } from "@/lib/validations/gallery";

function revalidateAffected() {
  revalidatePath("/");
  revalidatePath("/smile-gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/smile-cases");
}

export async function createGalleryItem(input: unknown) {
  await requireAccess("gallery");
  const parsed = gallerySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const item = await prisma.gallery.create({ data: parsed.data });
  await audit("create", "Gallery", item.id);
  revalidateAffected();
  return { success: true, id: item.id };
}

export async function updateGalleryItem(id: string, input: unknown) {
  await requireAccess("gallery");
  const parsed = gallerySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.gallery.update({ where: { id }, data: parsed.data });
  await audit("update", "Gallery", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteGalleryItem(id: string) {
  await requireAccess("gallery");
  await prisma.gallery.delete({ where: { id } });
  await audit("delete", "Gallery", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function createGalleryCategory(input: unknown) {
  await requireAccess("gallery");
  const parsed = galleryCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };
  const cat = await prisma.galleryCategory.create({ data: parsed.data });
  revalidateAffected();
  return { success: true, id: cat.id };
}

export async function deleteGalleryCategory(id: string) {
  await requireAccess("gallery");
  await prisma.galleryCategory.delete({ where: { id } });
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

// ── Smile Cases ──────────────────────────────────────────────────────────

export async function createSmileCase(input: unknown) {
  await requireAccess("gallery");
  const parsed = smileCaseSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const smileCase = await prisma.smileCase.create({ data: parsed.data });
  await audit("create", "SmileCase", smileCase.id);
  revalidateAffected();
  return { success: true, id: smileCase.id };
}

export async function updateSmileCase(id: string, input: unknown) {
  await requireAccess("gallery");
  const parsed = smileCaseSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.smileCase.update({ where: { id }, data: parsed.data });
  await audit("update", "SmileCase", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteSmileCase(id: string) {
  await requireAccess("gallery");
  await prisma.smileCase.delete({ where: { id } });
  await audit("delete", "SmileCase", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}
