"use client";

import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    icon: <FacebookIcon className="w-6 h-6" />,
    href: "#",
  },
  {
    label: "Instagram",
    icon: <InstagramIcon className="w-6 h-6" />,
    href: "#",
  },
  {
    label: "YouTube",
    icon: <YoutubeIcon className="w-6 h-6" />,
    href: "#",
  },
  {
    label: "TikTok",
    icon: <TiktokIcon className="w-6 h-6" />,
    href: "#",
  },
];

const NAV_LINKS = [
  { label: "Về Chúng Tôi", href: "/about" },
  { label: "Mẫu thiệp", href: "/templates" },
  { label: "Câu Hỏi Thường Gặp", href: "#" },
  { label: "Hợp Tác", href: "#" },
];

const CONTACT_INFO = [
  {
    icon: <MapPin size={16} />,
    label: "Địa chỉ",
    value: "1002 Tạ Quang Bửu, phường Bình Đông\nTP. Hồ Chí Minh",
  },
  { icon: <Phone size={16} />, label: "Điện thoại", value: "0909 123 456" },
  {
    icon: <Mail size={16} />,
    label: "Email",
    value: "tiemcuoitanthoi@gmail.com",
  },
  {
    icon: <Clock size={16} />,
    label: "Giờ làm việc",
    value: "Thứ 2 – Chủ Nhật\n08:00 – 20:00",
  },
];

function SocialBtn({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      className={`w-10 h-10 rounded-full border border-[#d4af37]/45 flex items-center justify-center text-[#d4af37] no-underline transition-all duration-250 shrink-0
        ${hovered ? "bg-linear-to-br from-[#d4af37] to-[#f5c842] text-[#1a0a0f] border-transparent -translate-y-0.5 shadow-lg" : "bg-[#d4af37]/6"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-2 text-[13.5px] text-[#a87d5e] no-underline transition-all duration-200 ${hovered ? "text-[#f5c842] gap-3" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={`text-[#d4af37] text-base leading-none transition-transform duration-200 ${hovered ? "translate-x-0.5" : ""}`}
        >
          ›
        </span>
        {label}
      </Link>
    </li>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch w-full max-w-130 gap-3 sm:gap-0"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Nhập email của bạn..."
        required
        aria-label="Nhập email đăng ký nhận bản tin"
        className={`w-full h-13 px-5 text-sm text-[#e8d5c0] bg-[#1a0a0f]/60 border-[1.5px] border-[#d4af37]/25 rounded-xl sm:rounded-r-none outline-none transition-all sm:border-r-0
          ${focused ? "border-[#d4af37]/60 shadow-[0_0_0_3px_rgba(212,175,55,0.1),inset_0_0_20px_rgba(212,175,55,0.05)]" : ""}`}
      />
      <Button
        type="submit"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`h-13 px-8 bg-linear-to-r from-[#d4af37] via-[#f5c842] to-[#d4af37] bg-size-[200%] border-none rounded-xl sm:rounded-l-none text-[#1a0a0f] text-xs font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-lg ${hovered ? "bg-right shadow-xl scale-[1.02]" : ""}`}
      >
        {submitted ? "Đã Gửi" : "Đăng Ký"}
      </Button>
    </form>
  );
}

function NewsletterSection() {
  return (
    <div className="border-y border-[#d4af37]/15 py-10 px-12 bg-[#d4af37]/3 max-sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-4 flex-[1_1_300px]">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#d4af37]/15 to-[#d4af37]/5 border-[1.5px] border-[#d4af37]/30 flex items-center justify-center text-[#f5c842] shrink-0 shadow-lg">
            <Mail size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-xl font-bold text-[#f5c842] mb-1.5">
              Đăng ký nhận ưu đãi độc quyền
            </div>
            <p className="text-[13.5px] text-[#a87d5e] m-0 leading-relaxed">
              Nhận ngay voucher{" "}
              <strong className="text-[#f5c842] font-bold">10%</strong> cho đơn
              đặt hàng đầu tiên
            </p>
          </div>
        </div>
        <NewsletterForm />
      </div>
    </div>
  );
}

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden flex flex-col bg-[linear-gradient(160deg,#120609_0%,#1f0b10_35%,#2a1018_65%,#120609_100%)] font-inherit">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 15% 20%, rgba(212,175,55,0.07) 0%, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 85% 75%, rgba(212,175,55,0.05) 0%, transparent 70%),
                       radial-gradient(ellipse 30% 30% at 50% 50%, rgba(180,60,60,0.04) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-1 w-full h-0.5 shrink-0 bg-[linear-gradient(90deg,transparent_0%,#8b6914_15%,#d4af37_40%,#f5c842_50%,#d4af37_60%,#8b6914_85%,transparent_100%)]" />

      <div className="relative z-1 flex items-center gap-4 px-12 pt-7 pb-5 max-sm:px-6">
        <span className="flex-1 h-px bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.35),transparent)]" />
        <span
          className="text-lg text-[#d4af37] tracking-[6px] whitespace-nowrap"
          style={{ textShadow: "0 0 20px rgba(212,175,55,0.6)" }}
        >
          ❧ ✦ ❧
        </span>
        <span className="flex-1 h-px bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.35),transparent)]" />
      </div>

      <div className="relative z-1 grid grid-cols-[3fr_2fr_2fr] gap-12 max-w-342.5 mx-auto px-12 pb-12 w-full box-border max-lg:grid-cols-[1fr] max-lg:gap-8">
        <div>
          <h2
            className="text-[2rem] font-extrabold leading-tight text-[#f5c842] m-0 mb-4 tracking-wide"
            style={{ textShadow: "0 2px 24px rgba(212,175,55,0.45)" }}
          >
            Tiệm cưới tân thời
          </h2>
          <p className="text-[13px] text-[#b89070] leading-relaxed m-0 mb-6 italic">
            Nơi mỗi khoảnh khắc trở thành kỷ niệm đẹp. Chúng tôi mang đến những
            bộ trang phục cưới tinh tế, sang trọng — xứng đáng với ngày trọng
            đại nhất của cuộc đời bạn.
          </p>
          <div className="flex gap-2.5 mb-5">
            {SOCIAL_LINKS.map((s) => (
              <SocialBtn
                key={s.label}
                href={s.href}
                label={s.label}
                icon={s.icon}
              />
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#d4af37]/8 border border-[#d4af37]/20 rounded-full max-w-fit">
            <span className="text-[#f5c842] text-[11px] tracking-[1px]">
              ★★★★★
            </span>
            <span className="text-[11px] text-[#c9a98a] whitespace-nowrap">
              Được tin tưởng bởi 2,000+ cặp đôi
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-[10.5px] font-bold tracking-[3px] uppercase text-[#d4af37] m-0 mb-5 flex items-center gap-2">
            Thông Tin
          </h3>
          <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
            {NAV_LINKS.map((item) => (
              <FooterLink
                key={item.label}
                href={item.href}
                label={item.label}
              />
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[10.5px] font-bold tracking-[3px] uppercase text-[#d4af37] m-0 mb-5 flex items-center gap-2">
            Liên Hệ
          </h3>
          <div className="flex flex-col gap-3.5">
            {CONTACT_INFO.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="w-8.5 h-8.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37] shrink-0">
                  {c.icon}
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#d4af37] tracking-[1.5px] uppercase mb-0.5">
                    {c.label}
                  </div>
                  <div className="text-[13px] text-[#e8d5c0] leading-relaxed whitespace-pre-line">
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />

      <div className="relative z-1 max-w-342.5 mx-auto w-full box-border px-12 py-5 flex flex-wrap items-center justify-between gap-3 max-sm:px-6 max-sm:flex-col max-sm:text-center">
        <p className="text-[12.5px] text-[#6b4f3a] m-0">
          Copyright © {currentYear}{" "}
          <span className="text-[#d4af37] text-xs">Tiệm cưới tân thời</span>.
          Bảo lưu mọi quyền.
        </p>
        <div className="flex gap-7">
          {["Điều khoản sử dụng", "Chính sách bảo mật", "Cookie"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-[#6b4f3a] no-underline transition-colors hover:text-[#d4af37] relative"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 h-px bg-[#d4af37] transition-all duration-250 w-0 hover:w-full" />
              </a>
            ),
          )}
        </div>
      </div>

      <div className="relative z-1 w-full h-px shrink-0 bg-[linear-gradient(90deg,transparent_0%,#5a440e_20%,#d4af37_50%,#5a440e_80%,transparent_100%)]" />
    </footer>
  );
}
