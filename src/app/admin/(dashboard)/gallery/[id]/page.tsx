import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { GalleryForm } from "@/components/admin/gallery-form";

export const metadata: Metadata = { title: "Edit Gallery Item" };

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.gallery.findUnique({ where: { id } }),
    prisma.galleryCategory.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!item) notFound();
  return <GalleryForm item={item} categories={categories} />;
}
