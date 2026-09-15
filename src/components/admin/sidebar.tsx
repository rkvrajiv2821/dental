"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "./nav-config";
import { can, type Role } from "@/lib/auth/rbac";
import { cn } from "@/lib/utils";

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          A
        </span>
        <span className="font-heading text-base font-semibold">Admin CMS</span>
      </div>
      <nav className="space-y-6 overflow-y-auto px-3 py-6" style={{ height: "calc(100vh - 4rem)" }}>
        {ADMIN_NAV.map((group) => {
          const items = group.items.filter((item) => can(role, item.resource));
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="mt-2 space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
