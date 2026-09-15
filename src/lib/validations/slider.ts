import { z } from "zod";

export const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  desktopImage: z.string().min(1, "Desktop image is required"),
  mobileImage: z.string().optional().nullable(),
  backgroundVideo: z.string().optional().nullable(),
  overlay: z.boolean().default(true),
  ctaText: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  ctaText2: z.string().optional().nullable(),
  ctaUrl2: z.string().optional().nullable(),
  textPosition: z.enum(["left", "center", "right"]).default("left"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});

export type SliderInput = z.infer<typeof sliderSchema>;
