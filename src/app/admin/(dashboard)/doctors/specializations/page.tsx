import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/category-manager";
import { createDoctorSpecialization, deleteDoctorSpecialization } from "@/lib/actions/doctors";

export const metadata: Metadata = { title: "Doctor Specializations" };

export default async function DoctorSpecializationsPage() {
  const specializations = await prisma.doctorSpecialization.findMany({ orderBy: { name: "asc" } });
  return (
    <CategoryManager
      title="Doctor Specializations"
      backHref="/admin/doctors"
      categories={specializations}
      onCreate={createDoctorSpecialization}
      onDelete={deleteDoctorSpecialization}
    />
  );
}
