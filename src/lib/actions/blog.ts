"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAccess, audit } from "./guard";
import { auth } from "@/lib/auth/auth";
import { blogPostSchema, blogCategorySchema, blogTagSchema } from "@/lib/validations/blog";

function revalidateAffected(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPost(input: unknown) {
  await requireAccess("blog");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { tagIds, ...data } = parsed.data;

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) return { success: false, message: "A post with this slug already exists." };

  const session = await auth();
  const publishedAt = data.status === "PUBLISHED" && !data.publishedAt ? new Date() : data.publishedAt;

  const post = await prisma.blogPost.create({
    data: { ...data, publishedAt, authorId: session?.user.id, tags: { connect: tagIds.map((id) => ({ id })) } },
  });
  await audit("create", "BlogPost", post.id);
  revalidateAffected(post.slug);
  return { success: true, id: post.id };
}

export async function updateBlogPost(id: string, input: unknown) {
  await requireAccess("blog");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  const { tagIds, ...data } = parsed.data;
  const publishedAt = data.status === "PUBLISHED" && !data.publishedAt ? new Date() : data.publishedAt;

  const post = await prisma.blogPost.update({
    where: { id },
    data: { ...data, publishedAt, tags: { set: tagIds.map((tid) => ({ id: tid })) } },
  });
  await audit("update", "BlogPost", id);
  revalidateAffected(post.slug);
  return { success: true, message: undefined as string | undefined };
}

export async function deleteBlogPost(id: string) {
  await requireAccess("blog");
  const post = await prisma.blogPost.delete({ where: { id } });
  await audit("delete", "BlogPost", id);
  revalidateAffected(post.slug);
  return { success: true, message: undefined as string | undefined };
}

export async function createBlogCategory(input: unknown) {
  await requireAccess("blog");
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };
  const cat = await prisma.blogCategory.create({ data: parsed.data });
  revalidateAffected();
  return { success: true, id: cat.id };
}

export async function deleteBlogCategory(id: string) {
  await requireAccess("blog");
  await prisma.blogCategory.delete({ where: { id } });
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}

export async function createBlogTag(input: unknown) {
  await requireAccess("blog");
  const parsed = blogTagSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };
  const tag = await prisma.blogTag.create({ data: parsed.data });
  revalidateAffected();
  return { success: true, id: tag.id };
}

export async function deleteBlogTag(id: string) {
  await requireAccess("blog");
  await prisma.blogTag.delete({ where: { id } });
  revalidateAffected();
  return { success: true, message: undefined as string | undefined };
}
