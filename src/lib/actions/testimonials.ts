"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { testimonialSchema } from "@/lib/validations/testimonial";

function revalidateAffected() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonial(input: unknown) {
  await requireAccess("testimonials");
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const testimonial = await prisma.testimonial.create({ data: parsed.data });
  await audit("create", "Testimonial", testimonial.id);
  revalidateAffected();
  return { success: true, id: testimonial.id };
}

export async function updateTestimonial(id: string, input: unknown) {
  await requireAccess("testimonials");
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await audit("update", "Testimonial", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function deleteTestimonial(id: string) {
  await requireAccess("testimonials");
  await prisma.testimonial.delete({ where: { id } });
  await audit("delete", "Testimonial", id);
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}
