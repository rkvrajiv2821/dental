import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { SeoSettingsForm } from "@/components/admin/seo-settings-form";

export const metadata: Metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const settings = await prisma.sEOSettings.findFirst();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold">SEO Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sitewide defaults. Individual treatments, doctors and blog posts can override these per page.
      </p>
      <div className="mt-6">
        <SeoSettingsForm settings={settings} />
      </div>
    </div>
  );
}
