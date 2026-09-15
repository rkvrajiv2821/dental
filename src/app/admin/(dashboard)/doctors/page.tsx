import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteDoctor } from "@/lib/actions/doctors";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Doctors" };

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({ include: { specialization: true }, orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/doctors/specializations">Manage Specializations</Link>
        </Button>
      </div>
      <AdminDataTable
        title="Doctors"
        newHref="/admin/doctors/new"
        rows={doctors}
        searchKey={(d) => d.name}
        editHref={(d) => `/admin/doctors/${d.id}`}
        onDelete={async (id) => deleteDoctor(id)}
        columns={[
          { header: "Name", cell: (d) => <span className="font-medium">{d.name}</span> },
          { header: "Specialization", cell: (d) => d.specialization?.name ?? "—" },
          { header: "Status", cell: (d) => <StatusBadge status={d.status} /> },
        ]}
      />
    </div>
  );
}
