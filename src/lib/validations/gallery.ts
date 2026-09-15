import { z } from "zod";

export const galleryCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  order: z.number().int().default(0),
});

export type GalleryCategoryInput = z.input<typeof galleryCategorySchema>;

export const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  image: z.string().min(1, "Image is required"),
  categoryId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type GalleryInput = z.input<typeof gallerySchema>;

export const smileCaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  caseId: z.string().min(1, "Case ID is required"),
  beforeImage: z.string().min(1, "Before image is required"),
  afterImage: z.string().min(1, "After image is required"),
  treatmentId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type SmileCaseInput = z.input<typeof smileCaseSchema>;
