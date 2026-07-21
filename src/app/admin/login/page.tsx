import { Suspense } from "react";
import { AdminLoginForm } from "@/features/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="gradient-mesh flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
