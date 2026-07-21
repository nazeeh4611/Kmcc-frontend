"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLock, FiMail, FiShield, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validators/authSchemas";
import { useAdminLogin } from "@/hooks/useAuthMutations";
import { extractErrorMessage } from "@/lib/apiClient";

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

      console.log("AdminLoginForm rendered",adminLogin);

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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "#f5f1eb",
    }}>
      <Card style={{
        width: "100%",
        maxWidth: "380px",
        border: "1px solid #e8e2da",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "none",
      }}>
        <CardHeader style={{
          padding: "36px 28px 4px 28px",
          textAlign: "center",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "12px",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#1a3d2f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}>
              <FiShield size={20} />
            </div>
          </div>
          <CardTitle style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#1a1a1a",
            letterSpacing: "-0.3px",
          }}>
            Admin Portal
          </CardTitle>
          <CardDescription style={{
            fontSize: "13px",
            color: "#8a8a8a",
            marginTop: "2px",
            fontWeight: "400",
          }}>
            Global KMCC Anganganadi Panchayath
          </CardDescription>
        </CardHeader>
        
        <CardContent style={{
          padding: "20px 28px 28px 28px",
        }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            {serverError && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "6px",
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                color: "#dc2626",
                fontSize: "13px",
              }}>
                {serverError}
              </div>
            )}

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}>
              <Label htmlFor="email" style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
              }}>
                Email Address
              </Label>
              <div style={{
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}>
                  <FiMail size={16} />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@kmccpanchayath.org"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    background: "#fafafa",
                    fontSize: "14px",
                    height: "42px",
                    outline: "none",
                    transition: "all 0.15s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a3d2f";
                    e.target.style.background = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.background = "#fafafa";
                  }}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  marginTop: "2px",
                }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}>
              <Label htmlFor="password" style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
              }}>
                Password
              </Label>
              <div style={{
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}>
                  <FiLock size={16} />
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    background: "#fafafa",
                    fontSize: "14px",
                    height: "42px",
                    outline: "none",
                    transition: "all 0.15s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a3d2f";
                    e.target.style.background = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.background = "#fafafa";
                  }}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  marginTop: "2px",
                }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || adminLogin.isPending}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "6px",
                background: "#1a3d2f",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: (isSubmitting || adminLogin.isPending) ? "0.7" : "1",
                marginTop: "2px",
              }}
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
              {(isSubmitting || adminLogin.isPending) ? (
                <>
                  <span style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={16} />
                </>
              )}
            </Button>

            <div style={{
              marginTop: "2px",
              textAlign: "center",
              fontSize: "12px",
              color: "#9ca3af",
              fontWeight: "400",
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "#d1d5db",
                  display: "inline-block",
                }} />
                Secure admin access only
                <span style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "#d1d5db",
                  display: "inline-block",
                }} />
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