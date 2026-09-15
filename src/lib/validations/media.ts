import { z } from "zod";

export const mediaUpdateSchema = z.object({
  filename: z.string().min(1).optional(),
  altText: z.string().optional().nullable(),
  folder: z.string().optional(),
});

export type MediaUpdateInput = z.input<typeof mediaUpdateSchema>;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
