import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            A
          </span>
          <h1 className="mt-4 font-heading text-2xl font-medium">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your clinic&apos;s website.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
