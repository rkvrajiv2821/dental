"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { audit } from "./guard";
import { userSchema } from "@/lib/validations/auth";
import { auth } from "@/lib/auth/auth";

async function requireSuperAdmin() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can manage users.");
  return session.user;
}

export async function createUser(input: unknown) {
  await requireSuperAdmin();
  const parsed = userSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };
  if (!parsed.data.password) return { success: false, message: "Password is required for new users." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { success: false, message: "A user with this email already exists." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, isActive: parsed.data.isActive, passwordHash },
  });
  await audit("create", "User", user.id);
  revalidatePath("/admin/users");
  return { success: true, id: user.id };
}

export async function updateUser(id: string, input: unknown) {
  await requireSuperAdmin();
  const parsed = userSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message };

  const data: Record<string, unknown> = {
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    isActive: parsed.data.isActive,
  };
  if (parsed.data.password) data.passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.update({ where: { id }, data });
  await audit("update", "User", id);
  revalidatePath("/admin/users");
  return { success: true, message: undefined as string | undefined };
}

export async function deleteUser(id: string) {
  const currentUser = await requireSuperAdmin();
  if (currentUser.id === id) return { success: false, message: "You can't delete your own account." };
  await prisma.user.delete({ where: { id } });
  await audit("delete", "User", id);
  revalidatePath("/admin/users");
  return { success: true, message: undefined as string | undefined };
}
