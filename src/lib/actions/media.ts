"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { deleteFromStorage } from "@/lib/storage/cloudinary";
import { mediaUpdateSchema } from "@/lib/validations/media";

export async function listMedia(params: { type?: "IMAGE" | "VIDEO" | "DOCUMENT"; search?: string } = {}) {
  await requireAccess("media");
  return prisma.media.findMany({
    where: {
      type: params.type,
      filename: params.search ? { contains: params.search, mode: "insensitive" } : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateMedia(id: string, input: unknown) {
  const user = await requireAccess("media");
  const parsed = mediaUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };

  await prisma.media.update({ where: { id }, data: parsed.data });
  await audit("update", "Media", id, { userId: user.id });
  revalidatePath("/admin/media");
  return { success: true, message: undefined as string | undefined };
}

export async function deleteMedia(id: string) {
  await requireAccess("media");
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { success: false, message: "Not found" };

  try {
    if (media.publicId) {
      await deleteFromStorage(media.publicId, media.type === "VIDEO" ? "video" : "image");
    }
    await prisma.media.delete({ where: { id } });
    await audit("delete", "Media", id);
    revalidatePath("/admin/media");
    return { success: true, message: undefined as string | undefined };
  } catch {
    return { success: false, message: "Failed to delete file from storage" };
  }
}
