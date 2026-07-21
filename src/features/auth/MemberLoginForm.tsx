"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiHash, FiLock, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { memberLoginSchema, type MemberLoginInput } from "@/lib/validators/authSchemas";
import { useMemberLogin } from "@/hooks/useAuthMutations";
import { extractErrorMessage } from "@/lib/apiClient";

export function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberLoginInput>({ resolver: zodResolver(memberLoginSchema) });

  const memberLogin = useMemberLogin();

  const onSubmit = async (values: MemberLoginInput) => {
    setServerError(null);
    try {
      await memberLogin.mutateAsync(values);
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  return (
    <Card className="w-full max-w-md animate-fade-up">
      <CardHeader className="items-center text-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-premium">
          <FiUser size={24} />
        </div>
        <CardTitle>Member Sign In</CardTitle>
        <CardDescription>Access your membership dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && <Alert variant="destructive">{serverError}</Alert>}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="membershipId">Membership ID</Label>
            <div className="relative">
              <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="membershipId"
                autoComplete="username"
                placeholder="GKAP-2026-000123"
                className="pl-10 uppercase placeholder:normal-case"
                {...register("membershipId")}
              />
            </div>
            {errors.membershipId && <p className="text-xs text-destructive">{errors.membershipId.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting || memberLogin.isPending} className="mt-2">
            {isSubmitting || memberLogin.isPending ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Not a member yet?{" "}
            <a href="/register" className="font-semibold text-primary hover:underline">
              Apply for membership
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
