"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useEffect } from "react";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().hydrate();

    const handleUnauthorized = () => {
      useAuthStore.getState().clearAuth();
    };
    window.addEventListener("unauthorized-event", handleUnauthorized);

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    if (accessToken && refreshToken) {
      useAuthStore.getState().updateTokens(accessToken, refreshToken);
      window.history.replaceState({}, "", window.location.pathname);
      import("@/services/auth.service").then(({ authService }) => {
        authService.getUserInfo().then((res) => {
          useAuthStore.getState().setAuth(res.data, accessToken, refreshToken);
        }).catch(() => {
          window.location.reload();
        });
      });
    }

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
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
