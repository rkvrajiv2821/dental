import { getSiteSettings, getSeoSettings } from "@/lib/data/settings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function organizationJsonLd() {
  const [settings, seo] = await Promise.all([getSiteSettings(), getSeoSettings()]);
  const hours = (settings.openingHours as { day: string; open: string; close: string; closed: boolean }[] | null) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": seo.schemaBusinessType || "Dentist",
    name: settings.clinicName,
    description: seo.defaultDescription ?? settings.tagline ?? undefined,
    url: SITE_URL,
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    address: settings.addressLine
      ? { "@type": "PostalAddress", streetAddress: settings.addressLine }
      : undefined,
    openingHoursSpecification: hours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    sameAs: Object.values((settings.socialLinks as Record<string, string> | null) ?? {}).filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  slug: string;
  publishedAt?: Date | null;
  updatedAt: Date;
  authorName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.featuredImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}
