import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteTechnology } from "@/lib/actions/technology";

export const metadata: Metadata = { title: "Technology" };

export default async function AdminTechnologyPage() {
  const items = await prisma.technology.findMany({ orderBy: { order: "asc" } });
  return (
    <AdminDataTable
      title="Technology"
      newHref="/admin/technology/new"
      rows={items}
      searchKey={(t) => t.name}
      editHref={(t) => `/admin/technology/${t.id}`}
      onDelete={async (id) => deleteTechnology(id)}
      columns={[
        { header: "Name", cell: (t) => <span className="font-medium">{t.name}</span> },
        { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
      ]}
    />
  );
}
