import { z } from "zod";

export const testimonialSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  photo: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  review: z.string().min(1, "Review is required"),
  treatmentId: z.string().optional().nullable(),
  doctorId: z.string().optional().nullable(),
  date: z.coerce.date().default(() => new Date()),
  videoUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  order: z.coerce.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
