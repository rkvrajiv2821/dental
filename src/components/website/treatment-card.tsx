import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Treatment, TreatmentCategory } from "@prisma/client";

export function TreatmentCard({ treatment }: { treatment: Treatment & { category?: TreatmentCategory | null } }) {
  return (
    <Link
      href={`/treatments/${treatment.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {treatment.heroImage ? (
          <Image
            src={treatment.heroImage}
            alt={treatment.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            {treatment.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {treatment.category && (
          <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
            {treatment.category.name}
          </span>
        )}
        <h3 className="font-heading text-lg font-medium text-foreground">{treatment.name}</h3>
        {treatment.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{treatment.shortDescription}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Learn more
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
