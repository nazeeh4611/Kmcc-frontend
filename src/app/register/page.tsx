import { MemberRegistrationForm } from "@/features/auth/MemberRegistrationForm";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function RegisterPage() {
  return (
    <main className="gradient-mesh flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="w-full max-w-2xl">
        <Breadcrumb items={[{ label: "Apply for Membership" }]} />
      </div>
      <MemberRegistrationForm />
    </main>
  );
}
