import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { DoctorForm } from "@/components/admin/doctor-form";

export const metadata: Metadata = { title: "Add Doctor" };

export default async function NewDoctorPage() {
  const [specializations, treatments] = await Promise.all([
    prisma.doctorSpecialization.findMany({ orderBy: { name: "asc" } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <DoctorForm specializations={specializations} treatments={treatments} />;
}
