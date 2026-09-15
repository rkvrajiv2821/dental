import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { DoctorForm } from "@/components/admin/doctor-form";

export const metadata: Metadata = { title: "Edit Doctor" };

export default async function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [doctor, specializations, treatments] = await Promise.all([
    prisma.doctor.findUnique({ where: { id }, include: { treatments: true } }),
    prisma.doctorSpecialization.findMany({ orderBy: { name: "asc" } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!doctor) notFound();
  return <DoctorForm doctor={doctor} specializations={specializations} treatments={treatments} />;
}
