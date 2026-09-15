import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getPublishedGallery = cache(async (limit?: number) => {
  return prisma.gallery.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    take: limit,
    include: { category: true },
  });
});

export const getGalleryCategories = cache(async () => {
  return prisma.galleryCategory.findMany({ orderBy: { order: "asc" } });
});

export const getPublishedSmileCases = cache(async (limit?: number) => {
  return prisma.smileCase.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    take: limit,
    include: { treatment: true },
  });
});
