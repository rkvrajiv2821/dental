import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { SlidersListClient } from "@/components/admin/sliders-list-client";

export const metadata: Metadata = { title: "Hero Sliders" };

export default async function AdminSlidersPage() {
  const sliders = await prisma.slider.findMany({ orderBy: { order: "asc" } });
  return <SlidersListClient initialSliders={sliders} />;
}
