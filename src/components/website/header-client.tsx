"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { HeaderLogo } from "./header-logo";

type NavItem = {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
  children: { id: string; label: string; url: string; openInNewTab: boolean }[];
};

export function HeaderClient({
  clinicName,
  logoUrl,
  phone,
  navItems,
}: {
  clinicName: string;
  logoUrl?: string | null;
  phone?: string | null;
  navItems: NavItem[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background/0"
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <HeaderLogo clinicName={clinicName} logoUrl={logoUrl} />

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.openInNewTab ? "_blank" : undefined}
              className={cn(
                "text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
                pathname === item.url && "text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          )}
          <Button asChild size="lg" className="rounded-full">
            <Link href="/appointment">Book Appointment</Link>
          </Button>
        </div>

        <Sheet key={pathname} open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm">
            <SheetHeader>
              <SheetTitle>
                <HeaderLogo clinicName={clinicName} logoUrl={logoUrl} />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 px-4">
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              )}
              <Button asChild size="lg" className="rounded-full">
                <Link href="/appointment">Book Appointment</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
