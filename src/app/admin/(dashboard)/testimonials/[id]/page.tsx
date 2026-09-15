import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata: Metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [testimonial, treatments, doctors] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!testimonial) notFound();
  return <TestimonialForm testimonial={testimonial} treatments={treatments} doctors={doctors} />;
}
