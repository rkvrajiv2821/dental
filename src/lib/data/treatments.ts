import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getPublishedTreatments = cache(async (limit?: number) => {
  return prisma.treatment.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    take: limit,
    include: { category: true },
  });
});

export const getTreatmentBySlug = cache(async (slug: string) => {
  return prisma.treatment.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      technologies: true,
      faqs: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" } },
      doctors: { include: { doctor: true } },
      testimonials: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" } },
      relatedTo: { where: { status: "PUBLISHED" } },
    },
  });
});

export const getTreatmentCategories = cache(async () => {
  return prisma.treatmentCategory.findMany({ orderBy: { order: "asc" } });
});
