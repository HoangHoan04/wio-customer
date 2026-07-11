"use client";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.login({ email, password });
      setAuth(res.user, res.accessToken, res.refreshToken);
      return res;
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.sendOtpVerify({ identifier: email, method: "EMAIL" });
      return res;
    } catch (err: any) {
      setError(err.message || "Gửi OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otpCode: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.verifyOtp({ identifier: email, otpCode, method: "EMAIL" });
      setAuth(res.user, res.accessToken, res.refreshToken);
      return res;
    } catch (err: any) {
      setError(err.message || "Xác thực OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch {
      console.error("Logout failed");
    } finally {
      useAuthStore.getState().clearAuth();
      setLoading(false);
      window.location.reload();
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.loginWithGoogle({ idToken });
      setAuth(res.user, res.accessToken, res.refreshToken);
      return res;
    } catch (err: any) {
      setError(err.message || "Đăng nhập Google thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async (accessToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.loginWithFacebook({ accessToken });
      setAuth(res.user, res.accessToken, res.refreshToken);
      return res;
    } catch (err: any) {
      setError(err.message || "Đăng nhập Facebook thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    login,
    sendOtp,
    verifyOtp,
    logout,
    loginWithGoogle,
    loginWithFacebook,
  };
}
