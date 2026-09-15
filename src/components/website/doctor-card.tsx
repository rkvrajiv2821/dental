import Link from "next/link";
import Image from "next/image";
import type { Doctor, DoctorSpecialization } from "@prisma/client";

export function DoctorCard({ doctor }: { doctor: Doctor & { specialization?: DoctorSpecialization | null } }) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        {doctor.profilePhoto ? (
          <Image
            src={doctor.profilePhoto}
            alt={doctor.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-heading text-muted-foreground">
            {doctor.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-4">
        <h3 className="font-heading text-lg font-medium text-foreground">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.designation ?? doctor.specialization?.name}</p>
      </div>
    </Link>
  );
}
