import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteVideo } from "@/lib/actions/technology";

export const metadata: Metadata = { title: "Videos" };

export default async function AdminVideosPage() {
  const items = await prisma.video.findMany({ orderBy: { order: "asc" } });
  return (
    <AdminDataTable
      title="Videos"
      newHref="/admin/videos/new"
      rows={items}
      searchKey={(v) => v.title}
      editHref={(v) => `/admin/videos/${v.id}`}
      onDelete={async (id) => deleteVideo(id)}
      columns={[
        { header: "Title", cell: (v) => <span className="font-medium">{v.title}</span> },
        { header: "Provider", cell: (v) => v.provider },
        { header: "Status", cell: (v) => <StatusBadge status={v.status} /> },
      ]}
    />
  );
}
