import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { TreatmentForm } from "@/components/admin/treatment-form";

export const metadata: Metadata = { title: "Edit Treatment" };

export default async function EditTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [treatment, categories, technologies, doctors, allTreatments] = await Promise.all([
    prisma.treatment.findUnique({
      where: { id },
      include: { technologies: true, doctors: true, relatedTo: true },
    }),
    prisma.treatmentCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.technology.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ orderBy: { name: "asc" } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!treatment) notFound();

  return (
    <TreatmentForm
      treatment={treatment}
      categories={categories}
      technologies={technologies}
      doctors={doctors}
      allTreatments={allTreatments}
    />
  );
}
