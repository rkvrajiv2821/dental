import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getActiveSliders = cache(async () => {
  const now = new Date();
  return prisma.slider.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    orderBy: { order: "asc" },
  });
});
