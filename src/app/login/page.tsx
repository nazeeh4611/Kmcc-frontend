import { Suspense } from "react";
import { MemberLoginForm } from "@/features/auth/MemberLoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-paper via-white to-paper">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brass/5 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-green/3 blur-3xl"></div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="flex h-64 w-full max-w-md items-center justify-center rounded-xl border border-line bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green border-t-transparent"></div>
          </div>
        }>
          <MemberLoginForm />
        </Suspense>
      </div>
    </main>
  );
}