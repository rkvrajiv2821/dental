import type { Metadata } from "next";
import { getPublishedDoctors } from "@/lib/data/doctors";
import { DoctorCard } from "@/components/website/doctor-card";
import { SectionHeading } from "@/components/website/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";

export const metadata: Metadata = { title: "Our Doctors", description: "Meet our team of specialist dentists." };

export default async function DoctorsPage() {
  const doctors = await getPublishedDoctors();

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Team" title="Meet Our Specialists" description="Experienced, compassionate and always current with the latest techniques." align="center" className="mx-auto" />
        <Stagger className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {doctors.map((d) => (
            <StaggerItem key={d.id}>
              <DoctorCard doctor={d} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
