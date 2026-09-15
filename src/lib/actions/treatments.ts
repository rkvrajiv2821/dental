"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { treatmentSchema, treatmentCategorySchema } from "@/lib/validations/treatment";

function revalidateAffected(slug?: string) {
  revalidatePath("/");
  revalidatePath("/treatments");
  revalidatePath("/admin/treatments");
  if (slug) revalidatePath(`/treatments/${slug}`);
}

export async function createTreatment(input: unknown) {
  await requireAccess("treatments");
  const parsed = treatmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { technologyIds, doctorIds, relatedTreatmentIds, ...data } = parsed.data;

  const existing = await prisma.treatment.findUnique({ where: { slug: data.slug } });
  if (existing) return { success: false, message: "A treatment with this slug already exists." };

  const treatment = await prisma.treatment.create({
    data: {
      ...data,
      technologies: { connect: technologyIds.map((id) => ({ id })) },
      doctors: { create: doctorIds.map((doctorId) => ({ doctorId })) },
      relatedTo: { connect: relatedTreatmentIds.map((id) => ({ id })) },
    },
  });
  await audit("create", "Treatment", treatment.id);
  revalidateAffected(treatment.slug);
  return { success: true, id: treatment.id };
}

export async function updateTreatment(id: string, input: unknown) {
  await requireAccess("treatments");
  const parsed = treatmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { technologyIds, doctorIds, relatedTreatmentIds, ...data } = parsed.data;

  await prisma.doctorTreatment.deleteMany({ where: { treatmentId: id } });
  const treatment = await prisma.treatment.update({
    where: { id },
    data: {
      ...data,
      technologies: { set: technologyIds.map((tid) => ({ id: tid })) },
      doctors: { create: doctorIds.map((doctorId) => ({ doctorId })) },
      relatedTo: { set: relatedTreatmentIds.map((tid) => ({ id: tid })) },
    },
  });
  await audit("update", "Treatment", id);
  revalidateAffected(treatment.slug);
  return { success: true, message: undefined as string | undefined };
}

export async function deleteTreatment(id: string) {
  await requireAccess("treatments");
  const treatment = await prisma.treatment.delete({ where: { id } });
  await audit("delete", "Treatment", id);
  revalidateAffected(treatment.slug);
  return { success: true, message: undefined as string | undefined };
}

// ── Categories ────────────────────────────────────────────────────────────

export async function createTreatmentCategory(input: unknown) {
  await requireAccess("treatments");
  const parsed = treatmentCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const category = await prisma.treatmentCategory.create({ data: parsed.data });
  await audit("create", "TreatmentCategory", category.id);
  revalidateAffected();
  return { success: true, id: category.id };
}

export async function deleteTreatmentCategory(id: string) {
  await requireAccess("treatments");
  await prisma.treatmentCategory.delete({ where: { id } });
  await audit("delete", "TreatmentCategory", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}
