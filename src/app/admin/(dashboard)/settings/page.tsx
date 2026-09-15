import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Global clinic information used across the website.</p>
      <div className="mt-6">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
