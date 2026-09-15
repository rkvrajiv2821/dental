import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { SliderForm } from "@/components/admin/slider-form";

export const metadata: Metadata = { title: "Edit Slide" };

export default async function EditSliderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slider = await prisma.slider.findUnique({ where: { id } });
  if (!slider) notFound();
  return <SliderForm slider={slider} />;
}
