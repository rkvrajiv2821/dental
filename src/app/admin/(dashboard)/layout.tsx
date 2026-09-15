import { auth } from "@/lib/auth/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import type { Role } from "@/lib/auth/rbac";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user.role ?? "CONTENT_MANAGER") as Role;
  const name = session?.user.name ?? "Admin";

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar name={name} role={role} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
