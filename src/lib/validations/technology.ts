import { z } from "zod";

export const technologySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  treatmentIds: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type TechnologyInput = z.input<typeof technologySchema>;

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  provider: z.enum(["YOUTUBE", "VIMEO", "EXTERNAL", "UPLOADED"]).default("YOUTUBE"),
  url: z.string().min(1, "URL is required"),
  thumbnail: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type VideoInput = z.input<typeof videoSchema>;

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().default("general"),
  treatmentId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type FAQInput = z.input<typeof faqSchema>;
