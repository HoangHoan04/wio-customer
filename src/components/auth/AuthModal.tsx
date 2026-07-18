"use client";

import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "login" | "register" | "forgot-password";

type RegisterStep = "form" | "otp";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [registerStep, setRegisterStep] = useState<RegisterStep>("form");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerOtp, setRegisterOtp] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "otp">("email");

  const {
    loading,
    error,
    setError,
    login,
    register,
    sendOtpRegistration,
    sendOtp,
    forgotPassword,
  } = useAuth();

  useEffect(() => {
    if (window.FB) return;
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "123456789";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4300";
    window.location.href = `${apiUrl}/api/user/auth/google`;
  };

  const handleFacebookLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4300";
    window.location.href = `${apiUrl}/api/user/auth/facebook`;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      toast.success("Đăng nhập thành công!");
      handleClose();
      if (!window.location.pathname.includes("/create")) {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    }
  };

  const handleSendRegisterOtp = async () => {
    if (!registerEmail) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
      setError("Email không hợp lệ");
      return;
    }
    try {
      await sendOtpRegistration(registerEmail);
      toast.success("Mã OTP đã được gửi đến email của bạn");
      setRegisterStep("otp");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Gửi OTP thất bại",
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (registerStep === "form") {
      if (
        !registerName ||
        !registerEmail ||
        !registerPassword ||
        !registerConfirmPassword
      ) {
        setError("Vui lòng điền đầy đủ tất cả các trường");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
        setError("Email không hợp lệ");
        return;
      }
      if (registerPassword.length < 6) {
        setError("Mật khẩu phải chứa ít nhất 6 ký tự");
        return;
      }
      if (registerPassword !== registerConfirmPassword) {
        setError("Mật khẩu xác nhận không trùng khớp");
        return;
      }
      await handleSendRegisterOtp();
      return;
    }

    if (!registerOtp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    try {
      await register({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        otpCode: registerOtp,
        sendMethod: "EMAIL",
      });
      toast.success("Đăng ký tài khoản thành công!");
      setActiveTab("login");
      setLoginEmail(registerEmail);
      setError("");
      setRegisterStep("form");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Đăng ký thất bại",
      );
    }
  };

  const handleSendForgotOtp = async () => {
    if (!forgotEmail) {
      setError("Vui lòng nhập email");
      return;
    }
    try {
      await sendOtp(forgotEmail, "EMAIL");
      toast.success("Mã OTP đã được gửi đến email của bạn");
      setForgotStep("otp");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Gửi OTP thất bại",
      );
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (forgotStep === "email") {
      await handleSendForgotOtp();
      return;
    }

    if (!forgotOtp || !forgotNewPassword || !forgotConfirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (forgotNewPassword.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    try {
      await forgotPassword({
        identifier: forgotEmail,
        otpCode: forgotOtp,
        newPassword: forgotNewPassword,
        method: "EMAIL",
      });
      toast.success("Khôi phục mật khẩu thành công!");
      setActiveTab("login");
      setLoginEmail(forgotEmail);
      setForgotStep("email");
      setError("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Khôi phục mật khẩu thất bại",
      );
    }
  };

  const handleClose = () => {
    setActiveTab("login");
    setRegisterStep("form");
    setForgotStep("email");
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPhone("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setRegisterOtp("");
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setError("");
    onClose();
  };

  const switchToTab = (tab: TabType) => {
    setActiveTab(tab);
    setRegisterStep("form");
    setForgotStep("email");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-110 p-0 bg-[#1a0a0f] border-[#d4af37]/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px] opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center w-full gap-6 p-8 mt-2">
          <div className="flex flex-col gap-2 relative w-full">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f5c842]">
              Tiệm cưới tân thời
            </h2>
            <p className="text-[#f5e6d3] text-[14px] opacity-80 font-medium">
              Hệ thống quản lý thiệp cưới thông minh
            </p>
          </div>

          {activeTab !== "forgot-password" && (
            <div className="flex w-full bg-white/5 p-1 rounded-xl border border-[#d4af37]/10">
              <button
                onClick={() => switchToTab("login")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "login"
                    ? "bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] shadow-md"
                    : "text-[#f5e6d3]/60 hover:text-[#f5e6d3] hover:bg-white/3"
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => switchToTab("register")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "register"
                    ? "bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] shadow-md"
                    : "text-[#f5e6d3]/60 hover:text-[#f5e6d3] hover:bg-white/3"
                }`}
              >
                Đăng ký
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-lg w-full">
              {error}
            </div>
          )}

          {activeTab === "login" && (
            <form
              onSubmit={handleLoginSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                />
                <Input
                  type="email"
                  placeholder="Email đăng nhập"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium"
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                />
                <Input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-10 text-sm outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5e6d3]/50 hover:text-[#f5e6d3] focus:outline-none"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchToTab("forgot-password")}
                  className="text-xs text-[#d4af37] hover:text-[#f5c842] transition-colors font-medium hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37] mt-2"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="w-full flex flex-col gap-5 mt-2">
                <div className="w-full flex items-center justify-center gap-4">
                  <div className="h-px bg-linear-to-r from-transparent to-[#d4af37]/30 flex-1" />
                  <span className="text-[11px] text-[#f5e6d3]/50 whitespace-nowrap font-semibold tracking-wider">
                    HOẶC ĐĂNG NHẬP VỚI
                  </span>
                  <div className="h-px bg-linear-to-l from-transparent to-[#d4af37]/30 flex-1" />
                </div>

                <div className="w-full flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleGoogleLogin()}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/3 border-[#d4af37]/15 rounded-xl hover:bg-white/8 hover:border-[#d4af37]/30"
                  >
                    <GoogleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Google</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFacebookLogin}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/3 border-[#d4af37]/15 rounded-xl hover:bg-white/8 hover:border-[#d4af37]/30"
                  >
                    <FacebookIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Facebook</span>
                  </Button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "register" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="w-full flex flex-col gap-4"
            >
              {registerStep === "form" ? (
                <>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type="text"
                      placeholder="Họ và tên của bạn"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type="email"
                      placeholder="Địa chỉ Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type="tel"
                      placeholder="Số điện thoại"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-10 text-sm outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5e6d3]/50 hover:text-[#f5e6d3] focus:outline-none"
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Xác nhận lại mật khẩu"
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-10 text-sm outline-none transition-all font-medium"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37] mt-2"
                  >
                    {loading ? "Đang gửi OTP..." : "Gửi mã xác thực"}
                  </Button>

                  <div className="w-full flex flex-col gap-5 mt-2">
                    <div className="w-full flex items-center justify-center gap-4">
                      <div className="h-px bg-linear-to-r from-transparent to-[#d4af37]/30 flex-1" />
                      <span className="text-[11px] text-[#f5e6d3]/50 whitespace-nowrap font-semibold tracking-wider">
                        HOẶC ĐĂNG KÝ VỚI
                      </span>
                      <div className="h-px bg-linear-to-l from-transparent to-[#d4af37]/30 flex-1" />
                    </div>

                    <div className="w-full flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGoogleLogin()}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/3 border-[#d4af37]/15 rounded-xl hover:bg-white/8 hover:border-[#d4af37]/30"
                      >
                        <GoogleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Google</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFacebookLogin}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/3 border-[#d4af37]/15 rounded-xl hover:bg-white/8 hover:border-[#d4af37]/30"
                      >
                        <FacebookIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Facebook</span>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setRegisterStep("form")}
                      className="text-[#d4af37] hover:text-[#f5c842] transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <p className="text-[#f5e6d3] text-sm font-medium">
                      Nhập mã OTP đã gửi đến email của bạn
                    </p>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type="text"
                      placeholder="Nhập mã OTP (6 số)"
                      value={registerOtp}
                      onChange={(e) => setRegisterOtp(e.target.value)}
                      maxLength={6}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium text-center tracking-widest"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendRegisterOtp}
                      className="text-xs text-[#d4af37] hover:text-[#f5c842] transition-colors font-medium hover:underline"
                    >
                      Gửi lại mã OTP
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37] mt-2"
                  >
                    {loading ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
                  </Button>
                </>
              )}
            </form>
          )}

          {activeTab === "forgot-password" && (
            <form
              onSubmit={handleForgotPasswordSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => switchToTab("login")}
                  className="text-[#d4af37] hover:text-[#f5c842] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <p className="text-[#f5e6d3] text-sm font-medium">
                  {forgotStep === "email"
                    ? "Khôi phục mật khẩu"
                    : "Nhập mã OTP"}
                </p>
              </div>

              {forgotStep === "email" ? (
                <>
                  <p className="text-[#f5e6d3]/60 text-xs text-left">
                    Nhập email của bạn để nhận mã xác thực
                  </p>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type="email"
                      placeholder="Email của bạn"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37] mt-2"
                  >
                    {loading ? "Đang gửi OTP..." : "Gửi mã xác thực"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type="text"
                      placeholder="Nhập mã OTP (6 số)"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      maxLength={6}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium text-center tracking-widest"
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type={showForgotPassword ? "text" : "password"}
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-10 text-sm outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(!showForgotPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5e6d3]/50 hover:text-[#f5e6d3] focus:outline-none"
                    >
                      {showForgotPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60"
                    />
                    <Input
                      type={showForgotPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu mới"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-10 text-sm outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendForgotOtp}
                      className="text-xs text-[#d4af37] hover:text-[#f5c842] transition-colors font-medium hover:underline"
                    >
                      Gửi lại mã OTP
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37] mt-2"
                  >
                    {loading ? "Đang xử lý..." : "Khôi phục mật khẩu"}
                  </Button>
                </>
              )}
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
