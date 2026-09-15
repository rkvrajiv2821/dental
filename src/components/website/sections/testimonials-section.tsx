import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/website/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import { getPublishedTestimonials } from "@/lib/data/testimonials";

export async function TestimonialsSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { limit?: number } }) {
  const testimonials = await getPublishedTestimonials(content.limit ?? 6);
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={subtitle} title={title} align="center" className="mx-auto" />
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-primary/40" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < t.rating ? "fill-gold text-gold" : "text-muted-foreground/30")} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">&ldquo;{t.review}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.patientName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.patientName}</p>
                  {t.treatment && <p className="text-xs text-muted-foreground">{t.treatment.name}</p>}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
