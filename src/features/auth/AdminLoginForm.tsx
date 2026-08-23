"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useAdminLogin } from "@/hooks/useAuthMutations";
import { extractErrorMessage } from "@/lib/apiClient";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validators/authSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/store/authContext";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading: isSessionLoading } = useAuth();
  const adminLogin = useAdminLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const alreadySignedIn = !isSessionLoading && session?.type === "admin";

  useEffect(() => {
    if (alreadySignedIn) {
      router.replace(searchParams.get("redirect") || "/admin/dashboard");
    }
  }, [alreadySignedIn, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AdminLoginInput) => {
    setServerError(null);
    try {
      await adminLogin.mutateAsync(values);
      const redirect = searchParams.get("redirect") || "/admin/dashboard";
      router.replace(redirect);
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  const pending = isSubmitting || adminLogin.isPending;

  if (isSessionLoading || alreadySignedIn) {
    return (
      <div className="flex h-40 w-full max-w-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-[400px] border-line bg-white/95 backdrop-blur-sm shadow-2xl shadow-primary/5">
      <CardHeader className="items-center pb-1 pt-9 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <ShieldCheck size={22} />
        </div>
        <CardTitle className="font-display text-2xl text-foreground">Admin Portal</CardTitle>
        <CardDescription>Global KMCC Anganganadi Panchayath</CardDescription>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@kmccpanchayath.org"
                className="h-11 pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 pl-9 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="lg" loading={pending} disabled={pending} className="mt-1 w-full">
            {pending ? "Signing in..." : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </Button>

          <p className="mt-1 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            Secure admin access only
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
