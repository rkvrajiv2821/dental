import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { FAQForm } from "@/components/admin/faq-form";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [faq, treatments] = await Promise.all([
    prisma.fAQ.findUnique({ where: { id } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!faq) notFound();
  return <FAQForm faq={faq} treatments={treatments} />;
}
