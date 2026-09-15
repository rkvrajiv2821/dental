"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { appointmentStatusSchema } from "@/lib/validations/appointment";
import { z } from "zod";

export async function updateAppointmentStatus(id: string, input: unknown) {
  await requireAccess("appointments");
  const parsed = appointmentStatusSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };
  await prisma.appointment.update({ where: { id }, data: parsed.data });
  await audit("update-status", "Appointment", id, { status: parsed.data.status });
  revalidatePath("/admin/appointments");
  return { success: true, message: undefined as string | undefined };
}

export async function deleteAppointment(id: string) {
  await requireAccess("appointments");
  await prisma.appointment.delete({ where: { id } });
  await audit("delete", "Appointment", id);
  revalidatePath("/admin/appointments");
  return { success: true, message: undefined as string | undefined };
}

const enquiryStatusSchema = z.object({ status: z.enum(["NEW", "RESPONDED", "CLOSED"]) });

export async function updateEnquiryStatus(id: string, input: unknown) {
  await requireAccess("enquiries");
  const parsed = enquiryStatusSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };
  await prisma.contactEnquiry.update({ where: { id }, data: parsed.data });
  await audit("update-status", "ContactEnquiry", id, { status: parsed.data.status });
  revalidatePath("/admin/enquiries");
  return { success: true, message: undefined as string | undefined };
}

export async function deleteEnquiry(id: string) {
  await requireAccess("enquiries");
  await prisma.contactEnquiry.delete({ where: { id } });
  await audit("delete", "ContactEnquiry", id);
  revalidatePath("/admin/enquiries");
  return { success: true, message: undefined as string | undefined };
}
