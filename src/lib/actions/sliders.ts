"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { sliderSchema } from "@/lib/validations/slider";

function revalidateAffected() {
  revalidatePath("/");
  revalidatePath("/admin/sliders");
}

export async function createSlider(input: unknown) {
  await requireAccess("sliders");
  const parsed = sliderSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };

  const count = await prisma.slider.count();
  const slider = await prisma.slider.create({ data: { ...parsed.data, order: count } });
  await audit("create", "Slider", slider.id);
  revalidateAffected();
  return { success: true, id: slider.id };
}

export async function updateSlider(id: string, input: unknown) {
  await requireAccess("sliders");
  const parsed = sliderSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };

  await prisma.slider.update({ where: { id }, data: parsed.data });
  await audit("update", "Slider", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteSlider(id: string) {
  await requireAccess("sliders");
  await prisma.slider.delete({ where: { id } });
  await audit("delete", "Slider", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function duplicateSlider(id: string) {
  await requireAccess("sliders");
  const original = await prisma.slider.findUnique({ where: { id } });
  if (!original) return { success: false, message: "Not found" };

  const count = await prisma.slider.count();
  const { id: _id, createdAt, updatedAt, ...rest } = original;
  const copy = await prisma.slider.create({
    data: { ...rest, title: `${original.title} (Copy)`, order: count, isActive: false },
  });
  await audit("duplicate", "Slider", copy.id);
  revalidateAffected();
  return { success: true, id: copy.id };
}

export async function toggleSliderActive(id: string, isActive: boolean) {
  await requireAccess("sliders");
  await prisma.slider.update({ where: { id }, data: { isActive } });
  await audit("toggle-active", "Slider", id, { isActive });
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function reorderSliders(orderedIds: string[]) {
  await requireAccess("sliders");
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.slider.update({ where: { id }, data: { order: index } }))
  );
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}
