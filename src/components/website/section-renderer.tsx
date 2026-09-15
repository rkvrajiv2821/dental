import type { PageSection } from "@prisma/client";
import { HeroSlider } from "./hero-slider";
import { StatisticsSection } from "./sections/statistics-section";
import { TextImageSection } from "./sections/text-image-section";
import { TreatmentsSection } from "./sections/treatments-section";
import { DoctorsSection } from "./sections/doctors-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { GallerySection } from "./sections/gallery-section";
import { BlogSection } from "./sections/blog-section";
import { CTASection } from "./sections/cta-section";
import { FAQSection } from "./sections/faq-section";
import { ThreeDSection } from "./sections/three-d-section";
import { VideoSection } from "./sections/video-section";
import { ParallaxImageSection } from "./sections/parallax-image-section";

export function SectionRenderer({ section }: { section: PageSection }) {
  const content = (section.content as Record<string, unknown>) ?? {};

  switch (section.type) {
    case "HERO_SLIDER":
      return <HeroSlider />;
    case "STATISTICS":
      return <StatisticsSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "TEXT_IMAGE":
      return <TextImageSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "TREATMENTS":
      return <TreatmentsSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "DOCTORS":
      return <DoctorsSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "TESTIMONIALS":
      return <TestimonialsSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "GALLERY":
      return <GallerySection title={section.title} subtitle={section.subtitle} content={content} />;
    case "BLOG":
      return <BlogSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "CTA":
      return <CTASection content={content} />;
    case "FAQ":
      return <FAQSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "THREE_D":
      return <ThreeDSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "VIDEO":
      return <VideoSection title={section.title} subtitle={section.subtitle} content={content} />;
    case "PARALLAX_IMAGE":
      return <ParallaxImageSection title={section.title} content={content} />;
    default:
      return null;
  }
}
