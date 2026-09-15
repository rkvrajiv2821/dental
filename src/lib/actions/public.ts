"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { appointmentSchema, contactEnquirySchema } from "@/lib/validations/appointment";

export async function submitAppointment(input: unknown) {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  // Honeypot: a filled hidden field means a bot filled the form.
  if (parsed.data.website) return { success: true, message: undefined as string | undefined };

  const { website, ...data } = parsed.data;
  await prisma.appointment.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      treatmentId: data.treatmentId || undefined,
      doctorId: data.doctorId || undefined,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime || undefined,
      message: data.message || undefined,
    },
  });
  revalidatePath("/admin/appointments");
  return { success: true, message: undefined as string | undefined };
}

export async function submitContactEnquiry(input: unknown) {
  const parsed = contactEnquirySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (parsed.data.website) return { success: true, message: undefined as string | undefined };

  const { website, ...data } = parsed.data;
  await prisma.contactEnquiry.create({
    data: {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      subject: data.subject || undefined,
      message: data.message,
    },
  });
  revalidatePath("/admin/enquiries");
  return { success: true, message: undefined as string | undefined };
}
