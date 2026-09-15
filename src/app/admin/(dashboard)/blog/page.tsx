import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteBlogPost } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog Posts" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/blog/categories">Categories</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/blog/tags">Tags</Link>
        </Button>
      </div>
      <AdminDataTable
        title="Blog Posts"
        newHref="/admin/blog/new"
        rows={posts}
        searchKey={(p) => p.title}
        editHref={(p) => `/admin/blog/${p.id}`}
        onDelete={async (id) => deleteBlogPost(id)}
        columns={[
          { header: "Title", cell: (p) => <span className="font-medium">{p.title}</span> },
          { header: "Category", cell: (p) => p.category?.name ?? "—" },
          { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          { header: "Date", cell: (p) => (p.publishedAt ? formatDate(p.publishedAt) : "—") },
        ]}
      />
    </div>
  );
}
