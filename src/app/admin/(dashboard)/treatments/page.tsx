import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteTreatment } from "@/lib/actions/treatments";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Treatments" };

export default async function AdminTreatmentsPage() {
  const treatments = await prisma.treatment.findMany({
    include: { category: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/treatments/categories">Manage Categories</Link>
        </Button>
      </div>
      <AdminDataTable
        title="Treatments"
        newHref="/admin/treatments/new"
        rows={treatments}
        searchKey={(t) => t.name}
        editHref={(t) => `/admin/treatments/${t.id}`}
        onDelete={async (id) => deleteTreatment(id)}
        columns={[
          { header: "Name", cell: (t) => <span className="font-medium">{t.name}</span> },
          { header: "Category", cell: (t) => t.category?.name ?? "—" },
          { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
        ]}
      />
    </div>
  );
}
