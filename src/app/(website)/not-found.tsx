import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WebsiteNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-7xl font-semibold text-primary">404</p>
      <h1 className="mt-3 font-heading text-2xl font-medium sm:text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
