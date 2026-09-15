import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { TechnologyForm } from "@/components/admin/technology-form";

export const metadata: Metadata = { title: "Edit Technology" };

export default async function EditTechnologyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [technology, treatments] = await Promise.all([
    prisma.technology.findUnique({ where: { id }, include: { treatments: true } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!technology) notFound();
  return <TechnologyForm technology={technology} treatments={treatments} />;
}
