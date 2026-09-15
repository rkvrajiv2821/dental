import { z } from "zod";

export const openingHoursSchema = z.array(
  z.object({
    day: z.string(),
    open: z.string().optional().default(""),
    close: z.string().optional().default(""),
    closed: z.boolean().default(false),
  })
);

export const socialLinksSettingsSchema = z.object({
  facebook: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
});

export const siteSettingsSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  tagline: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  addressLine: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  whatsappNumber: z.string().optional().nullable(),
  whatsappMessage: z.string().optional().nullable(),
  whatsappEnabled: z.boolean().default(true),
  whatsappPosition: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  openingHours: openingHoursSchema.optional(),
  socialLinks: socialLinksSettingsSchema.optional(),
  googleMapsEmbed: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  googleAnalyticsId: z.string().optional().nullable(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().min(1),
  titleTemplate: z.string().min(1),
  defaultDescription: z.string().optional().nullable(),
  defaultOgImage: z.string().optional().nullable(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  gscVerification: z.string().optional().nullable(),
  bingVerification: z.string().optional().nullable(),
  schemaBusinessType: z.enum(["Dentist", "MedicalBusiness", "LocalBusiness"]).default("Dentist"),
});

export type SEOSettingsInput = z.infer<typeof seoSettingsSchema>;

export const navigationSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  order: z.coerce.number().int().default(0),
  location: z.enum(["HEADER", "FOOTER"]).default("HEADER"),
  openInNewTab: z.boolean().default(false),
  isActive: z.boolean().default(true),
  parentId: z.string().optional().nullable(),
});

export type NavigationInput = z.infer<typeof navigationSchema>;
