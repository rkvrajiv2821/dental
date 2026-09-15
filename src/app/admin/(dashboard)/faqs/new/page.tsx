import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { FAQForm } from "@/components/admin/faq-form";

export const metadata: Metadata = { title: "Add FAQ" };

export default async function NewFAQPage() {
  const treatments = await prisma.treatment.findMany({ orderBy: { name: "asc" } });
  return <FAQForm treatments={treatments} />;
}
