import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/category-manager";
import { createBlogCategory, deleteBlogCategory } from "@/lib/actions/blog";

export const metadata: Metadata = { title: "Blog Categories" };

export default async function BlogCategoriesPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return <CategoryManager title="Blog Categories" backHref="/admin/blog" categories={categories} onCreate={createBlogCategory} onDelete={deleteBlogCategory} />;
}
