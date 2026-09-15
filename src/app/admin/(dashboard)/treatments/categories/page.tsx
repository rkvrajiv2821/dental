import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/category-manager";
import { createTreatmentCategory, deleteTreatmentCategory } from "@/lib/actions/treatments";

export const metadata: Metadata = { title: "Treatment Categories" };

export default async function TreatmentCategoriesPage() {
  const categories = await prisma.treatmentCategory.findMany({ orderBy: { order: "asc" } });
  return (
    <CategoryManager
      title="Treatment Categories"
      backHref="/admin/treatments"
      categories={categories}
      onCreate={createTreatmentCategory}
      onDelete={deleteTreatmentCategory}
    />
  );
}
