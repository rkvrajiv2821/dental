import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageReveal } from "@/components/animations/image-reveal";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/website/section-heading";
import { cn } from "@/lib/utils";

type Content = {
  body?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  imagePosition?: "left" | "right";
  features?: string[];
};

export function TextImageSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: Content }) {
  const imageLeft = content.imagePosition === "left";

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className={cn(imageLeft && "lg:order-2")}>
            <SectionHeading eyebrow={subtitle} title={title} />
            {content.body && <FadeIn delay={0.1}><p className="mt-6 text-base leading-relaxed text-muted-foreground">{content.body}</p></FadeIn>}
            {content.features && content.features.length > 0 && (
              <ul className="mt-6 space-y-3">
                {content.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {content.ctaText && content.ctaUrl && (
              <FadeIn delay={0.2} className="mt-8">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link href={content.ctaUrl}>{content.ctaText}</Link>
                </Button>
              </FadeIn>
            )}
          </div>
          <div className={cn(imageLeft && "lg:order-1")}>
            {content.image && (
              <ImageReveal
                src={content.image}
                alt={title ?? ""}
                width={800}
                height={640}
                wrapperClassName="aspect-[5/4] rounded-3xl"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
