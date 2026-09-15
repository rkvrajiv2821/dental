import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { deleteGalleryItem } from "@/lib/actions/gallery";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Clinic Gallery" };

export default async function AdminGalleryPage() {
  const items = await prisma.gallery.findMany({ include: { category: true }, orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/gallery/categories">Manage Categories</Link>
        </Button>
      </div>
      <AdminDataTable
        title="Clinic Gallery"
        newHref="/admin/gallery/new"
        rows={items}
        editHref={(i) => `/admin/gallery/${i.id}`}
        onDelete={async (id) => deleteGalleryItem(id)}
        columns={[
          {
            header: "Image",
            cell: (i) => (
              <div className="relative h-12 w-16 overflow-hidden rounded bg-muted">
                <Image src={i.image} alt={i.title ?? ""} fill className="object-cover" />
              </div>
            ),
          },
          { header: "Title", cell: (i) => i.title ?? "—" },
          { header: "Category", cell: (i) => i.category?.name ?? "—" },
        ]}
      />
    </div>
  );
}
