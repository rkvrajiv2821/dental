import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { MagneticButton } from "@/components/animations/magnetic-button";

type Content = { title?: string; subtitle?: string; ctaText?: string; ctaUrl?: string; phone?: string };

export function CTASection({ content }: { content: Content }) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-heading text-3xl font-medium sm:text-5xl">{content.title ?? "Ready for Your Best Smile?"}</h2>
          {content.subtitle && <p className="mt-4 text-lg text-primary-foreground/80">{content.subtitle}</p>}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Button asChild size="lg" className="rounded-full bg-white px-8 text-base text-primary hover:bg-white/90">
                <Link href={content.ctaUrl ?? "/appointment"}>{content.ctaText ?? "Book Appointment"}</Link>
              </Button>
            </MagneticButton>
            {content.phone && (
              <a href={`tel:${content.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" /> {content.phone}
              </a>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
