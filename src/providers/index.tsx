"use client";

import ToastContainer from "@/components/common/ToastContainer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import { normalizeAuthUser } from "@/utils/auth-user";
import React, { useEffect } from "react";
import { toast } from "sonner";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnauthorized = () => {
      useAuthStore.getState().clearAuth();
    };
    window.addEventListener("unauthorized-event", handleUnauthorized);

    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (oauthError || accessToken || refreshToken) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (oauthError) {
      useAuthStore.getState().hydrate();
      toast.error(oauthError);
      return () =>
        window.removeEventListener("unauthorized-event", handleUnauthorized);
    }

    if (accessToken && refreshToken) {
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().updateTokens(accessToken, refreshToken);

      import("@/services/auth.service").then(({ authService }) => {
        authService
          .getUserInfo()
          .then((res) => {
            useAuthStore
              .getState()
              .setAuth(
                normalizeAuthUser(res.data),
                accessToken,
                refreshToken,
              );
            toast.success("Đăng nhập thành công!");
          })
          .catch((err) => {
            useAuthStore.getState().clearAuth();
            toast.error(
              err.response?.data?.message ||
                "Không thể lấy thông tin tài khoản. Vui lòng thử lại.",
            );
          })
          .finally(() => {
            useAuthStore.getState().setLoading(false);
          });
      });

      return () =>
        window.removeEventListener("unauthorized-event", handleUnauthorized);
    }

    useAuthStore.getState().hydrate();

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
          <ToastContainer />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
