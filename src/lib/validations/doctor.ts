import { z } from "zod";

export const doctorSpecializationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export type DoctorSpecializationInput = z.infer<typeof doctorSpecializationSchema>;

export const socialLinksSchema = z.object({
  facebook: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
});

export const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  designation: z.string().optional().nullable(),
  specializationId: z.string().optional().nullable(),
  qualification: z.string().optional().nullable(),
  experienceYears: z.coerce.number().int().optional().nullable(),
  profilePhoto: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  languages: z.array(z.string()).default([]),
  registrationNumber: z.string().optional().nullable(),
  socialLinks: socialLinksSchema.optional().nullable(),
  availableDays: z.array(z.string()).default([]),
  availableTime: z.string().optional().nullable(),
  treatmentIds: z.array(z.string()).default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  order: z.coerce.number().int().default(0),
});

export type DoctorInput = z.infer<typeof doctorSchema>;
