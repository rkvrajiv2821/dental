import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/website/section-heading";
import { BeforeAfterSlider } from "@/components/website/before-after-slider";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { getPublishedSmileCases } from "@/lib/data/gallery";

export async function GallerySection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { limit?: number } }) {
  const cases = await getPublishedSmileCases(content.limit ?? 6);
  if (cases.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={subtitle} title={title} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/smile-gallery">View Full Gallery</Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <StaggerItem key={c.id}>
              <BeforeAfterSlider beforeImage={c.beforeImage} afterImage={c.afterImage} />
              <p className="mt-3 text-sm font-medium text-foreground">{c.title}</p>
              {c.category && <p className="text-xs text-muted-foreground">{c.category}</p>}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
