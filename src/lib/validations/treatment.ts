import { z } from "zod";

export const benefitItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
});

export const procedureStepSchema = z.object({
  step: z.number().int(),
  title: z.string().min(1),
  description: z.string().optional().default(""),
});

export const treatmentCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export type TreatmentCategoryInput = z.input<typeof treatmentCategorySchema>;

export const treatmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  benefits: z.array(benefitItemSchema).default([]),
  procedureSteps: z.array(procedureStepSchema).default([]),
  technologyIds: z.array(z.string()).default([]),
  doctorIds: z.array(z.string()).default([]),
  relatedTreatmentIds: z.array(z.string()).default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  order: z.number().int().default(0),
});

export type TreatmentInput = z.input<typeof treatmentSchema>;
