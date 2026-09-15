import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteFAQ } from "@/lib/actions/technology";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFAQsPage() {
  const items = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return (
    <AdminDataTable
      title="FAQs"
      newHref="/admin/faqs/new"
      rows={items}
      searchKey={(f) => f.question}
      editHref={(f) => `/admin/faqs/${f.id}`}
      onDelete={async (id) => deleteFAQ(id)}
      columns={[
        { header: "Question", cell: (f) => <span className="font-medium">{f.question}</span> },
        { header: "Category", cell: (f) => f.category },
        { header: "Status", cell: (f) => <StatusBadge status={f.status} /> },
      ]}
    />
  );
}
