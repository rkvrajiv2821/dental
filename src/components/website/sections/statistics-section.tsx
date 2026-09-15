import { Counter } from "@/components/animations/counter";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations/fade-in";

type StatItem = { label: string; value: number; suffix?: string; prefix?: string };

export function StatisticsSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { items?: StatItem[] } }) {
  const items = content.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <FadeIn className="mb-10 text-center">
            {subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-primary">{subtitle}</p>}
            {title && <h2 className="mt-2 font-heading text-3xl font-medium">{title}</h2>}
          </FadeIn>
        )}
        <Stagger className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.label} className="text-center">
              <div className="font-heading text-4xl font-semibold text-primary sm:text-5xl">
                <Counter value={item.value} suffix={item.suffix} prefix={item.prefix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
