"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminTopbar({ name, role }: { name: string; role: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        View Website <ExternalLink className="h-3.5 w-3.5" />
      </Link>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">{role.replace(/_/g, " ").toLowerCase()}</p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
