import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteSmileCase } from "@/lib/actions/gallery";

export const metadata: Metadata = { title: "Smile Gallery" };

export default async function AdminSmileCasesPage() {
  const cases = await prisma.smileCase.findMany({ orderBy: { order: "asc" } });

  return (
    <AdminDataTable
      title="Smile Gallery (Before/After)"
      newHref="/admin/smile-cases/new"
      rows={cases}
      searchKey={(c) => c.title}
      editHref={(c) => `/admin/smile-cases/${c.id}`}
      onDelete={async (id) => deleteSmileCase(id)}
      columns={[
        {
          header: "Before / After",
          cell: (c) => (
            <div className="flex gap-1">
              <div className="relative h-12 w-16 overflow-hidden rounded bg-muted">
                <Image src={c.beforeImage} alt="" fill className="object-cover" />
              </div>
              <div className="relative h-12 w-16 overflow-hidden rounded bg-muted">
                <Image src={c.afterImage} alt="" fill className="object-cover" />
              </div>
            </div>
          ),
        },
        { header: "Title", cell: (c) => c.title },
        { header: "Case ID", cell: (c) => c.caseId },
        { header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
      ]}
    />
  );
}
