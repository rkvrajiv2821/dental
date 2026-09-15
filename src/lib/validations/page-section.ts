import { z } from "zod";

export const sectionTypeEnum = z.enum([
  "HERO_SLIDER",
  "STATISTICS",
  "TEXT_IMAGE",
  "TREATMENTS",
  "DOCTORS",
  "TESTIMONIALS",
  "GALLERY",
  "VIDEO",
  "PARALLAX_IMAGE",
  "THREE_D",
  "FAQ",
  "CTA",
  "BLOG",
]);

export const pageSectionSchema = z.object({
  type: sectionTypeEnum,
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  content: z.record(z.string(), z.any()).default({}),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export type PageSectionInput = z.input<typeof pageSectionSchema>;
