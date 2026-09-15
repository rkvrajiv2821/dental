import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treatments, doctors, posts] = await Promise.all([
    prisma.treatment.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.doctor.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/treatments`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/doctors`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/smile-gallery`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/technology`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/appointment`, changeFrequency: "yearly", priority: 0.9 },
  ];

  return [
    ...staticRoutes,
    ...treatments.map((t) => ({ url: `${SITE_URL}/treatments/${t.slug}`, lastModified: t.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...doctors.map((d) => ({ url: `${SITE_URL}/doctors/${d.slug}`, lastModified: d.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
