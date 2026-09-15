import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/website/section-heading";
import { DoctorCard } from "@/components/website/doctor-card";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { getPublishedDoctors } from "@/lib/data/doctors";

export async function DoctorsSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { limit?: number } }) {
  const doctors = await getPublishedDoctors(content.limit ?? 4);
  if (doctors.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={subtitle} title={title} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/doctors">Meet the Team</Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {doctors.map((d) => (
            <StaggerItem key={d.id}>
              <DoctorCard doctor={d} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
