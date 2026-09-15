import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { HomepageSectionsClient } from "@/components/admin/homepage-sections-client";

export const metadata: Metadata = { title: "Homepage Sections" };

export default async function AdminHomepagePage() {
  const page = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: { slug: "home", title: "Home" },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  return <HomepageSectionsClient initialSections={page.sections} />;
}
