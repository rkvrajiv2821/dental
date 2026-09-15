import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  treatmentId: z.string().optional().nullable(),
  doctorId: z.string().optional().nullable(),
  preferredDate: z.coerce.date().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
  // honeypot spam-protection field — must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

export const appointmentStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional().nullable(),
});

export const contactEnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required").max(2000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
