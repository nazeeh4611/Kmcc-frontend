"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginInput = z.infer<typeof adminLoginSchema>;

const Button = ({
  children,
  type = "button",
  disabled = false,
  className = "",
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none";

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${baseStyles} ${className}`}
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
  onFocus,
  onBlur,
  ...props
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  [key: string]: any;
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`w-full px-3 py-2.5 text-sm bg-[#fafafa] border border-[#e5e7eb] rounded-md outline-none transition-all duration-150 focus:border-[#1a3d2f] focus:bg-white ${className}`}
      {...props}
    />
  );
};

const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-[#374151]"
    >
      {children}
    </label>
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
    <div className={`w-full max-w-[380px] bg-white border border-[#e8e2da] rounded-xl shadow-none ${className}`}>
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
    <div className={`px-7 pt-9 pb-1 text-center ${className}`}>
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
    <h2 className={`text-[22px] font-semibold text-[#1a1a1a] tracking-[-0.3px] ${className}`}>
      {children}
    </h2>
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
    <p className={`text-[13px] text-[#8a8a8a] font-normal mt-0.5 ${className}`}>
      {children}
    </p>
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
    <div className={`px-7 pb-7 pt-5 ${className}`}>
      {children}
    </div>
  );
};

const FiShield = ({ size = 20 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const FiMail = ({ size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const FiLock = ({ size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const FiArrowRight = ({ size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const useAdminLogin = () => {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (values: AdminLoginInput) => {
    setIsPending(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`, values);
      return response.data;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
};

const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
};

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "admin@kmcc.com",
      password: "kmcc@kmcc",
    },
  });

  const adminLogin = useAdminLogin();

  const onSubmit = async (values: AdminLoginInput) => {
    setServerError(null);
    try {
      await adminLogin.mutateAsync(values);
      const redirect = searchParams.get("redirect") || "/admin/dashboard";
      router.push(redirect);
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "#f5f1eb",
      }}
    >
      <Card>
        <CardHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#1a3d2f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <FiShield size={20} />
            </div>
          </div>
          <CardTitle>Admin Portal</CardTitle>
          <CardDescription>Global KMCC Anganganadi Panchayath</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {serverError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  background: "#fef2f2",
                  border: "1px solid #fee2e2",
                  color: "#dc2626",
                  fontSize: "13px",
                }}
              >
                {serverError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Label htmlFor="email">Email Address</Label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                >
                  <FiMail size={16} />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@kmccpanchayath.org"
                  style={{ paddingLeft: "38px", height: "42px" }}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#dc2626",
                    marginTop: "2px",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Label htmlFor="password">Password</Label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                >
                  <FiLock size={16} />
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  style={{ paddingLeft: "38px", height: "42px" }}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#dc2626",
                    marginTop: "2px",
                  }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || adminLogin.isPending}
              className="w-full h-[42px] rounded-md bg-[#1a3d2f] text-white text-sm font-medium gap-2 mt-0.5 hover:bg-[#143328]"
              onMouseEnter={(e) => {
                if (!(isSubmitting || adminLogin.isPending)) {
                  e.currentTarget.style.background = "#143328";
                }
              }}
              onMouseLeave={(e) => {
                if (!(isSubmitting || adminLogin.isPending)) {
                  e.currentTarget.style.background = "#1a3d2f";
                }
              }}
            >
              {isSubmitting || adminLogin.isPending ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={16} />
                </>
              )}
            </Button>

            <div
              style={{
                marginTop: "2px",
                textAlign: "center",
                fontSize: "12px",
                color: "#9ca3af",
                fontWeight: "400",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "#d1d5db",
                    display: "inline-block",
                  }}
                />
                Secure admin access only
                <span
                  style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "#d1d5db",
                    display: "inline-block",
                  }}
                />
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}