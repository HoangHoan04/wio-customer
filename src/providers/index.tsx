"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().hydrate();

    const handleUnauthorized = () => {
      useAuthStore.getState().clearAuth();
    };
    window.addEventListener("unauthorized-event", handleUnauthorized);
    return () =>
      window.removeEventListener("unauthorized-event", handleUnauthorized);
  }, []);
  return <>{children}</>;
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <QueryProvider>
          <TooltipProvider>
            <AuthInitializer>{children}</AuthInitializer>
            <Toaster />
          </TooltipProvider>
        </QueryProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
