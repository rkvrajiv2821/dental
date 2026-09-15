import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findFirst();
  return (
    settings ?? {
      id: "default",
      clinicName: "Dental Clinic",
      tagline: null,
      logoUrl: null,
      faviconUrl: null,
      addressLine: null,
      phone: null,
      email: null,
      whatsappNumber: null,
      whatsappMessage: "Hello! I would like to book an appointment.",
      whatsappEnabled: false,
      whatsappPosition: "bottom-right",
      openingHours: null,
      socialLinks: null,
      googleMapsEmbed: null,
      footerText: null,
      googleAnalyticsId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
});

export const getSeoSettings = cache(async () => {
  const settings = await prisma.sEOSettings.findFirst();
  return (
    settings ?? {
      id: "default",
      defaultTitle: "Dental Clinic",
      titleTemplate: "%s | Dental Clinic",
      defaultDescription: null,
      defaultOgImage: null,
      robotsIndex: true,
      robotsFollow: true,
      gscVerification: null,
      bingVerification: null,
      schemaBusinessType: "Dentist",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
});

export const getNavigation = cache(async (location: "HEADER" | "FOOTER" = "HEADER") => {
  return prisma.navigation.findMany({
    where: { location, isActive: true, parentId: null },
    include: { children: { where: { isActive: true }, orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
});
