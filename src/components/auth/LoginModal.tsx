"use client";

import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const { loading, error, setError, sendOtp, verifyOtp, loginWithGoogle, loginWithFacebook } = useAuth();

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
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        toast.success("Đăng nhập Google thành công");
        onClose();
        if (!window.location.pathname.includes("/create")) {
          window.location.reload();
        }
      } catch (err: any) {
        toast.error(err.message || "Đăng nhập Google thất bại");
      }
    },
    onError: () => {
      toast.error("Không thể đăng nhập bằng Google");
    },
  });

  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error("Không thể kết nối tới Facebook. Vui lòng thử lại sau.");
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          loginWithFacebook(accessToken)
            .then(() => {
              toast.success("Đăng nhập Facebook thành công");
              onClose();
              if (!window.location.pathname.includes("/create")) {
                window.location.reload();
              }
            })
            .catch((err) => {
              toast.error(err.message || "Đăng nhập Facebook thất bại");
            });
        } else {
          toast.info("Đăng nhập bằng Facebook đã bị hủy");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  useEffect(() => {
    if (step === "otp") {
      const firstInput = document.getElementById("otp-input-0");
      firstInput?.focus();
    }
  }, [step]);

  useEffect(() => {
    let interval: number;
    if (step === "otp" && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      await sendOtp(email);
      setStep("otp");
      setTimer(60);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số");
      return;
    }

    try {
      await verifyOtp(email, otpCode);
      onClose();
      if (!window.location.pathname.includes("/create")) {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    setError("");

    try {
      await sendOtp(email);
      setTimer(60);
      setOtp(Array(6).fill(""));
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi gửi lại OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);

    const lastInput = document.getElementById(`otp-input-5`);
    lastInput?.focus();
  };

  const handleBack = () => {
    setStep("email");
    setError("");
    setOtp(Array(6).fill(""));
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setOtp(Array(6).fill(""));
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[420px] p-0 bg-[#1a0a0f] border-[#d4af37]/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px] opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center w-full gap-8 p-8 mt-2">
          <div className="flex flex-col gap-2 relative w-full">
            {step === "otp" && (
              <button
                onClick={handleBack}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#f5e6d3] hover:text-[#f5c842] transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-white/5"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f5c842]">
              Tiệm Cưới Tân Thời
            </h2>
            <p className="text-[#f5e6d3] text-[14px] opacity-80 font-medium">
              {step === "email"
                ? "Chào mừng bạn đến với hệ thống thiệp cưới"
                : "Xác thực mã đăng nhập OTP"}
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-lg w-full">
              {error}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-5">
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60" />
                  <input
                    type="email"
                    placeholder="Nhập email để nhận mã OTP"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl h-12 bg-white/3 border border-[#d4af37]/15 focus:border-[#d4af37]/30 focus:bg-[#d4af37]/5 text-[#f5e6d3] pl-10 pr-4 text-sm outline-none transition-all font-medium"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37]"
                >
                  {loading ? "Đang xử lý..." : "Tiếp tục"}
                </Button>
                <span className="text-xs text-[#f5e6d3]/50">
                  Mã xác thực sẽ được gửi đến email của bạn
                </span>
              </div>
              <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-[#f5e6d3]/80">
                  <Check size={18} className="text-emerald-500 shrink-0" strokeWidth={3} />
                  <span className="font-light">Không cần mật khẩu</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#f5e6d3]/80">
                  <Check size={18} className="text-emerald-500 shrink-0" strokeWidth={3} />
                  <span className="font-light">Đăng nhập an toàn với mã OTP</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#f5e6d3]/80">
                  <Check size={18} className="text-emerald-500 shrink-0" strokeWidth={3} />
                  <span className="font-light">Hoàn toàn miễn phí</span>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-5">
                <p className="text-xs text-[#f5e6d3]/70 text-center leading-relaxed">
                  Mã xác thực đã được gửi đến email:
                  <br />
                  <span className="font-semibold text-[#f5c842]">{email}</span>
                </p>

                <div className="flex gap-2 justify-center w-full my-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/3 text-[#f5c842] border border-[#d4af37]/20 rounded-xl focus:border-[#f5c842] focus:ring-1 focus:ring-[#f5c842] focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="text-center text-xs">
                  {timer > 0 ? (
                    <span className="text-[#f5e6d3]/50">
                      Gửi lại mã sau <span className="text-[#f5c842] font-semibold">{timer}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-[#d4af37] hover:text-[#f5c842] underline cursor-pointer bg-transparent border-none font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendLoading ? "Đang gửi lại..." : "Chưa nhận được mã? Gửi lại mã"}
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl font-bold h-11 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:from-[#f5c842] hover:to-[#d4af37]"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </div>
            </form>
          )}

          {step === "email" && (
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex items-center justify-center gap-4">
                <div className="h-px bg-linear-to-r from-transparent to-[#d4af37]/30 flex-1" />
                <span className="text-[11px] text-[#f5e6d3]/50 whitespace-nowrap font-semibold tracking-wider">
                  HOẶC ĐĂNG NHẬP VỚI
                </span>
                <div className="h-px bg-linear-to-l from-transparent to-[#d4af37]/30 flex-1" />
              </div>

              <div className="w-full flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleGoogleLogin()}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/3 border-[#d4af37]/15 rounded-xl hover:bg-white/8 hover:border-[#d4af37]/30"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFacebookLogin}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/3 border-[#d4af37]/15 rounded-xl hover:bg-white/8 hover:border-[#d4af37]/30"
                >
                  <FacebookIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Facebook</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
