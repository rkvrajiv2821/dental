"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { pageSectionSchema } from "@/lib/validations/page-section";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

async function getHomePageId() {
  const page = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: { slug: "home", title: "Home" },
  });
  return page.id;
}

export async function createSection(input: unknown) {
  await requireAccess("homepage");
  const parsed = pageSectionSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };

  const pageId = await getHomePageId();
  const count = await prisma.pageSection.count({ where: { pageId } });
  const section = await prisma.pageSection.create({ data: { ...parsed.data, pageId, order: count } });
  await audit("create", "PageSection", section.id);
  revalidate();
  return { success: true, id: section.id };
}

export async function updateSection(id: string, input: unknown) {
  await requireAccess("homepage");
  const parsed = pageSectionSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.pageSection.update({ where: { id }, data: parsed.data });
  await audit("update", "PageSection", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteSection(id: string) {
  await requireAccess("homepage");
  await prisma.pageSection.delete({ where: { id } });
  await audit("delete", "PageSection", id);
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function toggleSectionVisibility(id: string, isVisible: boolean) {
  await requireAccess("homepage");
  await prisma.pageSection.update({ where: { id }, data: { isVisible } });
  revalidate();
  return { success: true, message: undefined as string | undefined };
}

export async function duplicateSection(id: string) {
  await requireAccess("homepage");
  const original = await prisma.pageSection.findUnique({ where: { id } });
  if (!original) return { success: false, message: "Not found" };
  const count = await prisma.pageSection.count({ where: { pageId: original.pageId } });
  const { id: _id, createdAt, updatedAt, ...rest } = original;
  const copy = await prisma.pageSection.create({
    data: { ...rest, content: rest.content as Prisma.InputJsonValue, order: count },
  });
  await audit("duplicate", "PageSection", copy.id);
  revalidate();
  return { success: true, id: copy.id };
}

export async function reorderSections(orderedIds: string[]) {
  await requireAccess("homepage");
  await prisma.$transaction(orderedIds.map((id, index) => prisma.pageSection.update({ where: { id }, data: { order: index } })));
  revalidate();
  return { success: true, message: undefined as string | undefined };
}
