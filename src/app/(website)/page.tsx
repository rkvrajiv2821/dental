import type { Metadata } from "next";
import { getHomePage } from "@/lib/data/misc";
import { getSeoSettings } from "@/lib/data/settings";
import { SectionRenderer } from "@/components/website/section-renderer";
import { HeroSlider } from "@/components/website/hero-slider";
import { organizationJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const [page, seo] = await Promise.all([getHomePage(), getSeoSettings()]);
  const title = page?.seoTitle ?? seo.defaultTitle;
  const description = page?.seoDescription ?? seo.defaultDescription ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, images: page?.ogImage ? [page.ogImage] : undefined },
  };
}

export default async function HomePage() {
  const page = await getHomePage();
  const sections = page?.sections ?? [];
  const hasHeroSection = sections.some((s) => s.type === "HERO_SLIDER");

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(await organizationJsonLd()) }}
      />
      {!hasHeroSection && <HeroSlider />}
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
