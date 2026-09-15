import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { GalleryForm } from "@/components/admin/gallery-form";

export const metadata: Metadata = { title: "Add Gallery Item" };

export default async function NewGalleryItemPage() {
  const categories = await prisma.galleryCategory.findMany({ orderBy: { order: "asc" } });
  return <GalleryForm categories={categories} />;
}
