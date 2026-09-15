import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getPublishedFAQs = cache(async (category?: string, limit?: number) => {
  return prisma.fAQ.findMany({
    where: { status: "PUBLISHED", ...(category ? { category } : {}) },
    orderBy: { order: "asc" },
    take: limit,
  });
});

export const getPublishedTechnologies = cache(async (limit?: number) => {
  return prisma.technology.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    take: limit,
  });
});

export const getPublishedVideos = cache(async (limit?: number) => {
  return prisma.video.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    take: limit,
  });
});

export const getHomePage = cache(async () => {
  return prisma.page.findUnique({
    where: { slug: "home" },
    include: { sections: { where: { isVisible: true }, orderBy: { order: "asc" } } },
  });
});
