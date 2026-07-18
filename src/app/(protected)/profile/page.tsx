"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { authService } from "@/services/auth.service";
import { Calendar, Lock, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

const C = {
  bg: "#0b0507",
  bgCard: "#140a0d",
  gold: "#c5a059",
  goldLight: "#e5c483",
  cream: "#f9f6f0",
  muted: "#a38a75",
  border: "rgba(197, 160, 89, 0.15)",
};

export default function ProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    authService
      .getUserInfo()
      .then((res: any) => {
        if (res.data) {
          const user = res.data;
          setEmail(user.email || "");
          setPhone(user.phone || "");

          if (user.customer) {
            setFullName(user.customer.fullName || "");
            setGender(user.customer.gender || "");
            if (user.customer.dateOfBirth) {
              setDateOfBirth(
                new Date(user.customer.dateOfBirth).toISOString().split("T")[0],
              );
            }
          }
        }
      })
      .catch((err) => {
        console.error(err);
        showToast({
          message: "Không thể lấy thông tin tài khoản",
          type: "error",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast({ message: "Họ và tên không được để trống", type: "error" });
      return;
    }
    setSavingInfo(true);
    try {
      await authService.updateProfile({
        fullName,
        phone,
        gender,
        dateOfBirth: dateOfBirth || null,
      });
      showToast({
        message: "Cập nhật thông tin cá nhân thành công!",
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err.response?.data?.message || "Cập nhật thất bại",
        type: "error",
      });
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({
        message: "Vui lòng điền đầy đủ thông tin mật khẩu",
        type: "error",
      });
      return;
    }
    if (newPassword.length < 6) {
      showToast({
        message: "Mật khẩu mới phải có tối thiểu 6 ký tự",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: "Mật khẩu mới không trùng khớp", type: "error" });
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      showToast({ message: "Đổi mật khẩu thành công!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err.response?.data?.message || "Đổi mật khẩu thất bại",
        type: "error",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center"
        style={{ background: C.bg }}
      >
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-36 px-4 sm:px-8 lg:px-16 pb-24"
      style={{ background: C.bg, color: C.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600&display=swap');
        .profile-container {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 20px;
        }
      `}</style>

      <div className="max-w-200 mx-auto w-full">
        <h1
          className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-center mb-12"
          style={{
            fontFamily: "'Cinzel', serif",
            background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 50%, ${C.goldLight} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Thông tin tài khoản
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Personal Info Section */}
          <div className="profile-container p-8 shadow-xl">
            <h2
              className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif", color: C.goldLight }}
            >
              <User size={18} />
              Thông tin cá nhân
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                  Email (Đăng nhập)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                    <Mail size={16} />
                  </span>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="pl-10.5 bg-black/25! border-[#d4af37]/10! text-[#f5e6d3]/60! cursor-not-allowed rounded-lg text-sm w-full py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                  Họ và tên
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                    <User size={16} />
                  </span>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Nhập họ và tên"
                    className="pl-10.5 bg-black/20! border-[#d4af37]/20! hover:border-[#d4af37]/45! focus:border-[#d4af37]! text-[#f5e6d3]! rounded-lg text-sm w-full py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                      <Phone size={16} />
                    </span>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="pl-10.5 bg-black/20! border-[#d4af37]/20! hover:border-[#d4af37]/45! focus:border-[#d4af37]! text-[#f5e6d3]! rounded-lg text-sm w-full py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                      <Calendar size={16} />
                    </span>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="pl-10.5 bg-black/20! border-[#d4af37]/20! hover:border-[#d4af37]/45! focus:border-[#d4af37]! text-[#f5e6d3]! rounded-lg text-sm w-full py-2.5"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                  Giới tính
                </label>
                <div className="flex gap-6 mt-1 text-sm">
                  {["Nam", "Nữ", "Khác"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={(e) => setGender(e.target.value)}
                        className="accent-[#c5a059]"
                      />
                      <span className="text-[#f5e6d3]/85">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={savingInfo}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs"
                  style={{
                    background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)`,
                    color: C.bg,
                    boxShadow: "0 4px 15px rgba(197,160,89,0.3)",
                  }}
                >
                  {savingInfo ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="profile-container p-8 shadow-xl">
            <h2
              className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif", color: C.goldLight }}
            >
              <Lock size={18} />
              Đổi mật khẩu
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                    <Lock size={16} />
                  </span>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu hiện tại"
                    className="pl-10.5 bg-black/20! border-[#d4af37]/20! hover:border-[#d4af37]/45! focus:border-[#d4af37]! text-[#f5e6d3]! rounded-lg text-sm w-full py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                      <Lock size={16} />
                    </span>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      className="pl-10.5 bg-black/20! border-[#d4af37]/20! hover:border-[#d4af37]/45! focus:border-[#d4af37]! text-[#f5e6d3]! rounded-lg text-sm w-full py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider block mb-2 text-[#f5e6d3]/60 font-medium">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#f5e6d3]/40">
                      <Lock size={16} />
                    </span>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Nhập lại mật khẩu mới"
                      className="pl-10.5 bg-black/20! border-[#d4af37]/20! hover:border-[#d4af37]/45! focus:border-[#d4af37]! text-[#f5e6d3]! rounded-lg text-sm w-full py-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs"
                  style={{
                    background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)`,
                    color: C.bg,
                    boxShadow: "0 4px 15px rgba(197,160,89,0.3)",
                  }}
                >
                  {savingPassword ? "Đang đổi..." : "Thay đổi mật khẩu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
