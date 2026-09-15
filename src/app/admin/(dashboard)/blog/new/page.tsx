import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata: Metadata = { title: "Write Blog Post" };

export default async function NewBlogPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <BlogPostForm categories={categories} tags={tags} />;
}
