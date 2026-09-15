import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { UsersListClient } from "@/components/admin/users-list-client";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin/dashboard");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return <UsersListClient initialUsers={users} currentUserId={session.user.id} />;
}
