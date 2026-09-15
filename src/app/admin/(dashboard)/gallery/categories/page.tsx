import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/category-manager";
import { createGalleryCategory, deleteGalleryCategory } from "@/lib/actions/gallery";

export const metadata: Metadata = { title: "Gallery Categories" };

export default async function GalleryCategoriesPage() {
  const categories = await prisma.galleryCategory.findMany({ orderBy: { order: "asc" } });
  return (
    <CategoryManager title="Gallery Categories" backHref="/admin/gallery" categories={categories} onCreate={createGalleryCategory} onDelete={deleteGalleryCategory} />
  );
}
