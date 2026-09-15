"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { doctorSchema, doctorSpecializationSchema } from "@/lib/validations/doctor";

function revalidateAffected(slug?: string) {
  revalidatePath("/");
  revalidatePath("/doctors");
  revalidatePath("/admin/doctors");
  if (slug) revalidatePath(`/doctors/${slug}`);
}

export async function createDoctor(input: unknown) {
  await requireAccess("doctors");
  const parsed = doctorSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { treatmentIds, specializationId, socialLinks, ...data } = parsed.data;

  const doctor = await prisma.doctor.create({
    data: {
      ...data,
      specializationId: specializationId ?? null,
      socialLinks: (socialLinks ?? undefined) as Prisma.InputJsonValue | undefined,
      treatments: { create: treatmentIds.map((treatmentId) => ({ treatmentId })) },
    },
  });
  await audit("create", "Doctor", doctor.id);
  revalidateAffected(doctor.slug);
  return { success: true, id: doctor.id };
}

export async function updateDoctor(id: string, input: unknown) {
  await requireAccess("doctors");
  const parsed = doctorSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { treatmentIds, specializationId, socialLinks, ...data } = parsed.data;

  await prisma.doctorTreatment.deleteMany({ where: { doctorId: id } });
  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      ...data,
      specializationId: specializationId ?? null,
      socialLinks: (socialLinks ?? undefined) as Prisma.InputJsonValue | undefined,
      treatments: { create: treatmentIds.map((treatmentId) => ({ treatmentId })) },
    },
  });
  await audit("update", "Doctor", id);
  revalidateAffected(doctor.slug);
  return { success: true, message: undefined as string | undefined };
}

export async function deleteDoctor(id: string) {
  await requireAccess("doctors");
  const doctor = await prisma.doctor.delete({ where: { id } });
  await audit("delete", "Doctor", id);
  revalidateAffected(doctor.slug);
  return { success: true, message: undefined as string | undefined };
}

export async function createDoctorSpecialization(input: unknown) {
  await requireAccess("doctors");
  const parsed = doctorSpecializationSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };
  const spec = await prisma.doctorSpecialization.create({ data: parsed.data });
  revalidateAffected();
  return { success: true, id: spec.id };
}

export async function deleteDoctorSpecialization(id: string) {
  await requireAccess("doctors");
  await prisma.doctorSpecialization.delete({ where: { id } });
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}
