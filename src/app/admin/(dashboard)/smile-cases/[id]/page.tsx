import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { SmileCaseForm } from "@/components/admin/smile-case-form";

export const metadata: Metadata = { title: "Edit Smile Case" };

export default async function EditSmileCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [smileCase, treatments] = await Promise.all([
    prisma.smileCase.findUnique({ where: { id } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!smileCase) notFound();
  return <SmileCaseForm smileCase={smileCase} treatments={treatments} />;
}
