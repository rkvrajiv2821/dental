"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function WebsiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Something went wrong</p>
      <h1 className="mt-3 font-heading text-3xl font-medium sm:text-4xl">We hit a snag loading this page</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Please try again. If this keeps happening, contact us and we&apos;ll help right away.
      </p>
      <div className="mt-8 flex gap-4">
        <Button onClick={() => reset()} size="lg" className="rounded-full">
          Try again
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
