import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

// A SCHEDULED post whose publishedAt has arrived is treated as published for display purposes.
// (The admin list still shows it as "Scheduled" until an editor action flips the DB status.)
const visibleToPublic = {
  OR: [
    { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } },
    { status: "SCHEDULED" as const, publishedAt: { lte: new Date() } },
  ],
};

export const getPublishedPosts = cache(async (limit?: number) => {
  return prisma.blogPost.findMany({
    where: visibleToPublic,
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true, author: true, tags: true },
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findFirst({
    where: { slug, ...visibleToPublic },
    include: { category: true, author: true, tags: true },
  });
});

export const getBlogCategories = cache(async () => {
  return prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
});
