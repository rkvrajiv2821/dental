import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getPublishedTestimonials = cache(async (limit?: number, featuredOnly = false) => {
  return prisma.testimonial.findMany({
    where: { status: "PUBLISHED", ...(featuredOnly ? { featured: true } : {}) },
    orderBy: { order: "asc" },
    take: limit,
    include: { treatment: true, doctor: true },
  });
});
