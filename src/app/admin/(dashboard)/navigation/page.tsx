import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { NavigationManager } from "@/components/admin/navigation-manager";

export const metadata: Metadata = { title: "Navigation" };

export default async function AdminNavigationPage() {
  const [headerItems, footerItems] = await Promise.all([
    prisma.navigation.findMany({ where: { location: "HEADER" }, orderBy: { order: "asc" } }),
    prisma.navigation.findMany({ where: { location: "FOOTER" }, orderBy: { order: "asc" } }),
  ]);
  return <NavigationManager headerItems={headerItems} footerItems={footerItems} />;
}
