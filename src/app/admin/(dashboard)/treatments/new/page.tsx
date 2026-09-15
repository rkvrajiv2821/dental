import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { TreatmentForm } from "@/components/admin/treatment-form";

export const metadata: Metadata = { title: "Add Treatment" };

export default async function NewTreatmentPage() {
  const [categories, technologies, doctors] = await Promise.all([
    prisma.treatmentCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.technology.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <TreatmentForm categories={categories} technologies={technologies} doctors={doctors} allTreatments={[]} />;
}
