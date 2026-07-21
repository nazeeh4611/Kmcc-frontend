"use client";

import { useAuth } from "@/store/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Member } from "@/types";

export default function MemberDashboardPage() {
  const { session, logout, isLoggingOut } = useAuth();
  const member = session?.user as Member | undefined;

  return (
    <main className="min-h-screen bg-surface p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-utility text-sm text-primary">Welcome back</p>
            <h1 className="font-display text-2xl font-bold text-foreground">{member?.fullName}</h1>
          </div>
          <Button variant="outline" onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Membership overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>Membership ID: {member?.membershipId}</p>
            <p>Status: {member?.membershipStatus}</p>
            <p>Days remaining: {member?.daysRemaining}</p>
            <p className="pt-2 text-foreground/70">
              The full member dashboard (card download, family members, notifications) is the next
              build phase — this page confirms the auth foundation works end to end.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
