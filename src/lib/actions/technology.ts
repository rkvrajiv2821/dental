"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { technologySchema, videoSchema, faqSchema } from "@/lib/validations/technology";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/technology");
  revalidatePath("/admin/technology");
  revalidatePath("/admin/videos");
  revalidatePath("/admin/faqs");
}

// ── Technology ───────────────────────────────────────────────────────────

export async function createTechnology(input: unknown) {
  await requireAccess("technology");
  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { treatmentIds, ...data } = parsed.data;
  const tech = await prisma.technology.create({ data: { ...data, treatments: { connect: treatmentIds.map((id) => ({ id })) } } });
  await audit("create", "Technology", tech.id);
  revalidate();
  return { success: true, id: tech.id };
}

export async function updateTechnology(id: string, input: unknown) {
  await requireAccess("technology");
  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { treatmentIds, ...data } = parsed.data;
  await prisma.technology.update({ where: { id }, data: { ...data, treatments: { set: treatmentIds.map((tid) => ({ id: tid })) } } });
  await audit("update", "Technology", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteTechnology(id: string) {
  await requireAccess("technology");
  await prisma.technology.delete({ where: { id } });
  await audit("delete", "Technology", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

// ── Videos ───────────────────────────────────────────────────────────────

export async function createVideo(input: unknown) {
  await requireAccess("videos");
  const parsed = videoSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const video = await prisma.video.create({ data: parsed.data });
  await audit("create", "Video", video.id);
  revalidate();
  return { success: true, id: video.id };
}

export async function updateVideo(id: string, input: unknown) {
  await requireAccess("videos");
  const parsed = videoSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.video.update({ where: { id }, data: parsed.data });
  await audit("update", "Video", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteVideo(id: string) {
  await requireAccess("videos");
  await prisma.video.delete({ where: { id } });
  await audit("delete", "Video", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

// ── FAQ ──────────────────────────────────────────────────────────────────

export async function createFAQ(input: unknown) {
  await requireAccess("faq");
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const faq = await prisma.fAQ.create({ data: parsed.data });
  await audit("create", "FAQ", faq.id);
  revalidate();
  return { success: true, id: faq.id };
}

export async function updateFAQ(id: string, input: unknown) {
  await requireAccess("faq");
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.fAQ.update({ where: { id }, data: parsed.data });
  await audit("update", "FAQ", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteFAQ(id: string) {
  await requireAccess("faq");
  await prisma.fAQ.delete({ where: { id } });
  await audit("delete", "FAQ", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}
