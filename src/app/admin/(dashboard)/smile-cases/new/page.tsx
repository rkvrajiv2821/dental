import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { SmileCaseForm } from "@/components/admin/smile-case-form";

export const metadata: Metadata = { title: "Add Smile Case" };

export default async function NewSmileCasePage() {
  const treatments = await prisma.treatment.findMany({ orderBy: { name: "asc" } });
  return <SmileCaseForm treatments={treatments} />;
}
