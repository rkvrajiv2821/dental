import Link from "next/link";

export function HeaderLogo({ clinicName, logoUrl }: { clinicName: string; logoUrl?: string | null }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-heading text-xl font-semibold tracking-tight">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={clinicName} className="h-9 w-auto" />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
          {clinicName.charAt(0)}
        </span>
      )}
      <span>{clinicName}</span>
    </Link>
  );
}
