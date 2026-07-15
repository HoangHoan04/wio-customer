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
      setError(err.response?.data?.message || err.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOtpRegistration = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.sendOtpRegistration({
        email,
        sendMethod: "EMAIL",
      });
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gửi OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (identifier: string, method: "EMAIL" | "PHONE" = "EMAIL") => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.sendOtpVerify({
        identifier,
        method,
      });
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gửi OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (identifier: string, otpCode: string, method: "EMAIL" | "PHONE" = "EMAIL") => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.verifyOtp({
        identifier,
        otpCode,
        method,
      });
      setAuth(res.user, res.accessToken, res.refreshToken);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Xác thực OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    otpCode: string;
    sendMethod: "EMAIL" | "PHONE";
    gender?: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.register(data);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data: {
    identifier: string;
    otpCode: string;
    newPassword: string;
    method: "EMAIL" | "PHONE";
  }) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.forgotPassword(data);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Khôi phục mật khẩu thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.changePassword(data);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = useAuthStore.getState().user
        ? useAuthStore.getState().user?.id
          ? useAuthStore.getState().user
          : null
        : null;
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
      setError(err.response?.data?.message || err.message || "Đăng nhập Google thất bại");
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
      setError(err.response?.data?.message || err.message || "Đăng nhập Facebook thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkPhoneEmail = async (data: { email?: string; phone?: string }) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.checkPhoneEmail(data);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Kiểm tra thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string, otpCode: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.verifyEmail({ email, otpCode });
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Xác thực email thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.resendVerification({ email });
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gửi lại mã thất bại");
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
    register,
    sendOtp,
    sendOtpRegistration,
    verifyOtp,
    forgotPassword,
    changePassword,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    checkPhoneEmail,
    verifyEmail,
    resendVerification,
  };
}
