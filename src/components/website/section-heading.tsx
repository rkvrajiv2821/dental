import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  align?: "left" | "center";
  className?: string;
}) {
  if (!title && !eyebrow && !description) return null;

  return (
    <FadeIn className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="font-heading text-3xl font-medium leading-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      )}
      {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
    </FadeIn>
  );
}
