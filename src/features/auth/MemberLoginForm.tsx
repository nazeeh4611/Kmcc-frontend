"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemberLogin } from "@/hooks/useAuthMutations";
import { extractErrorMessage } from "@/lib/memberApiClient";
import { memberLoginSchema, type MemberLoginInput } from "@/lib/validators/authSchemas";
import { useMemberAuth } from "@/store/memberAuthContext";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const Button = ({
  children,
  type = "button",
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline";
  size?: "default" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-green text-white hover:bg-green-800 focus:ring-green",
    outline:
      "border-2 border-green/20 bg-white/50 text-ink hover:border-green hover:bg-green/5 hover:text-green",
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    lg: "h-14 px-8 py-3 text-base rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({
  id,
  type = "text",
  placeholder,
  className = "",
  autoComplete,
  ...props
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  [key: string]: any;
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`w-full bg-white/70 border border-line rounded-xl px-4 py-3 text-sm font-body text-ink placeholder:text-slate/40 transition-all duration-200 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/20 hover:border-green/30 ${className}`}
      {...props}
    />
  );
};

const Label = ({
  children,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`font-body text-sm font-semibold text-ink ${className}`}
    >
      {children}
    </label>
  );
};

const Alert = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}) => {
  const variantStyles = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-300 text-red-800",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-white/90 backdrop-blur-sm shadow-2xl shadow-green/5 ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative border-b border-dashed border-line pb-6 pt-8 px-8 ${className}`}
    >
      {children}
    </div>
  );
};

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={`font-display text-3xl text-ink ${className}`}>{children}</h2>
  );
};

const CardDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={`font-body text-slate/70 text-base ${className}`}>{children}</p>
  );
};

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative px-8 pb-8 pt-6 ${className}`}>{children}</div>
  );
};

const FiHash = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const FiLock = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const FiUser = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const FiArrowRight = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const FiShield = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const FiCheckCircle = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const FiGlobe = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const FiUsers = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FiAward = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const FiHeart = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const FiEye = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const FiEyeOff = ({ size = 20, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isSessionLoading } = useMemberAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotHelp, setShowForgotHelp] = useState(false);
  const memberLogin = useMemberLogin();

  const alreadySignedIn = !isSessionLoading && isAuthenticated;

  useEffect(() => {
    if (alreadySignedIn) {
      router.replace(searchParams.get("redirect") || "/dashboard");
    }
  }, [alreadySignedIn, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberLoginInput>({
    resolver: zodResolver(memberLoginSchema),
    defaultValues: {
      membershipId: "",
      password: "",
    },
  });

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

  if (isSessionLoading || alreadySignedIn) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green/20 border-t-green" />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8faf8] pt-20 pb-16 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Member Login" }]} />
        <div className="mt-6 grid lg:grid-cols-[1fr,1fr] gap-12 items-start">
          <div className="hidden lg:block pt-8">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-green/5 blur-3xl"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-brass/5 blur-3xl"></div>

              <div className="relative">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-green/20 bg-white/90 backdrop-blur-sm px-5 py-2.5 font-utility text-[11px] font-semibold uppercase tracking-[0.22em] text-green shadow-sm">
                  <FiHeart className="h-4 w-4 text-green" />
                  Overseas Cultural Wing of IUML
                </span>

                <h1 className="mt-10 font-display text-5xl font-bold leading-[1.1] text-ink">
                  Welcome Back to
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="absolute -inset-2 bg-gradient-to-r from-green/10 to-brass/10 blur-2xl"></span>
                    <span className="relative bg-gradient-to-r from-green to-brass bg-clip-text text-transparent">
                      Global KMCC
                    </span>
                  </span>
                </h1>

                <p className="mt-6 font-body text-lg leading-relaxed text-slate/80 max-w-md">
                  Sign in to manage your membership, access exclusive resources,
                  and stay connected with our global community.
                </p>

             

              
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <Card>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green via-brass to-green"></div>

              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green/5 blur-3xl"></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brass/5 blur-3xl"></div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.22em] text-green">
                    Member Access
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-green">
                    <FiCheckCircle className="h-3 w-3" />
                    Secure
                  </span>
                </div>
                <CardTitle className="mt-4">Member Sign In</CardTitle>
                <CardDescription>Access your membership dashboard</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  {serverError && (
                    <Alert variant="destructive">
                      <FiShield className="h-5 w-5 flex-shrink-0" />
                      <span className="font-body text-sm">{serverError}</span>
                    </Alert>
                  )}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="membershipId">Membership ID</Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40 transition-colors group-focus-within:text-green">
                        <FiHash className="h-5 w-5" />
                      </div>
                      <Input
                        id="membershipId"
                        type="text"
                        autoComplete="username"
                        placeholder="1001"
                        className="h-14 pl-12"
                        {...register("membershipId")}
                      />
                    </div>
                    {errors.membershipId && (
                      <p className="font-body text-xs text-red-600 flex items-center gap-1 mt-1">
                        <FiShield className="h-3 w-3" />
                        {errors.membershipId.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={() => setShowForgotHelp((v) => !v)}
                        className="font-body text-xs text-green/70 transition-colors hover:text-green hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    {showForgotHelp && (
                      <p className="rounded-lg bg-green/5 px-3 py-2 font-body text-xs text-slate/80">
                        Passwords are reset by your panchayath coordinator or office admin. Please contact
                        them with your Membership ID to get a new password.
                      </p>
                    )}
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40 transition-colors group-focus-within:text-green">
                        <FiLock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="••••"
                        className="h-14 pl-12 pr-12"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate/40 transition-colors hover:text-green focus:outline-none focus:ring-2 focus:ring-green/20 rounded-lg p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="font-body text-xs text-red-600 flex items-center gap-1 mt-1">
                        <FiShield className="h-3 w-3" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-green to-brass font-body text-base font-semibold text-white shadow-lg shadow-green/25 transition-all duration-300 hover:shadow-xl hover:shadow-green/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    {isSubmitting ? (
                      <>
                        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <FiArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-line"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white/90 backdrop-blur-sm px-5 font-body text-sm text-slate/60">
                        New member?
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="group h-14 w-full rounded-xl border-2 border-green/20 bg-white/50 font-body text-sm font-semibold text-ink transition-all duration-200 hover:border-green hover:bg-green/5 hover:text-green hover:shadow-lg hover:shadow-green/5"
                    onClick={() => router.push("/register")}
                  >
                    <FiUser className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Apply for Membership
                  </Button>

                  <div className="mt-2 flex items-center justify-center gap-6">
                    <span className="font-body text-xs text-slate/40 flex items-center gap-1.5">
                      <FiCheckCircle className="h-3 w-3 text-green/40" />
                      Secure Login
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate/20" aria-hidden="true"></span>
                    <span className="font-body text-xs text-slate/40 flex items-center gap-1.5">
                      <FiShield className="h-3 w-3 text-green/40" />
                      SSL Encrypted
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate/20" aria-hidden="true"></span>
                    <span className="font-body text-xs text-slate/40 flex items-center gap-1.5">
                      <FiHeart className="h-3 w-3 text-green/40" />
                      24/7 Support
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}