import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await prisma.sEOSettings.findFirst();
  const allowed = seo?.robotsIndex ?? true;

  return {
    rules: {
      userAgent: "*",
      [allowed ? "allow" : "disallow"]: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
