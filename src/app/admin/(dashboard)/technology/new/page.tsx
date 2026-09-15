import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { TechnologyForm } from "@/components/admin/technology-form";

export const metadata: Metadata = { title: "Add Technology" };

export default async function NewTechnologyPage() {
  const treatments = await prisma.treatment.findMany({ orderBy: { name: "asc" } });
  return <TechnologyForm treatments={treatments} />;
}
