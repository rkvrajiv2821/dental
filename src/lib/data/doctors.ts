import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getPublishedDoctors = cache(async (limit?: number) => {
  return prisma.doctor.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    take: limit,
    include: { specialization: true },
  });
});

export const getDoctorBySlug = cache(async (slug: string) => {
  return prisma.doctor.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      specialization: true,
      treatments: { include: { treatment: true } },
      testimonials: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" } },
    },
  });
});
