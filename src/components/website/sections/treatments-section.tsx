import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/website/section-heading";
import { TreatmentCard } from "@/components/website/treatment-card";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { getPublishedTreatments } from "@/lib/data/treatments";

export async function TreatmentsSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { limit?: number } }) {
  const treatments = await getPublishedTreatments(content.limit ?? 6);
  if (treatments.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={subtitle} title={title} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/treatments">View All Treatments</Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <StaggerItem key={t.id}>
              <TreatmentCard treatment={t} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
