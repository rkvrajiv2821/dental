import { z } from "zod";

export const blogCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
});

export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;

export const blogTagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export type BlogTagInput = z.infer<typeof blogTagSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
