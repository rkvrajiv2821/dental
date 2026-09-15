import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/category-manager";
import { createBlogTag, deleteBlogTag } from "@/lib/actions/blog";

export const metadata: Metadata = { title: "Blog Tags" };

export default async function BlogTagsPage() {
  const tags = await prisma.blogTag.findMany({ orderBy: { name: "asc" } });
  return <CategoryManager title="Blog Tags" backHref="/admin/blog" categories={tags} onCreate={createBlogTag} onDelete={deleteBlogTag} />;
}
