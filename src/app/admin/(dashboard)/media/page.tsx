import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { MediaLibraryClient } from "@/components/admin/media-library-client";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return <MediaLibraryClient initialMedia={media} />;
}
