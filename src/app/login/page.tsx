import { Suspense } from "react";
import { MemberLoginForm } from "@/features/auth/MemberLoginForm";

export default function LoginPage() {
  return (
    <main className="gradient-mesh flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <MemberLoginForm />
      </Suspense>
    </main>
  );
}
