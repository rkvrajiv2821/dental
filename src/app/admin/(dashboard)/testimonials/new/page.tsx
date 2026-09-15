import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata: Metadata = { title: "Add Testimonial" };

export default async function NewTestimonialPage() {
  const [treatments, doctors] = await Promise.all([
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <TestimonialForm treatments={treatments} doctors={doctors} />;
}
