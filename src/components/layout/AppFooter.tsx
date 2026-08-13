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
  { label: "Về chúng tôi", href: "/about" },
  { label: "Mẫu thiệp", href: "/templates" },
  { label: "Câu hỏi thường gặp", href: "/#faq" },
  { label: "Hướng dẫn", href: "/user-manual" },
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
      className={`w-10 h-10 rounded-full border border-[#2D231F]/20 flex items-center justify-center text-[#2D231F] no-underline transition-all duration-250 shrink-0
        ${hovered ? "bg-[#2D231F] text-[#F3EDE3] border-transparent -translate-y-0.5 shadow-lg" : "bg-transparent"}`}
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
        className={`flex items-center gap-2 text-[13.5px] text-[#7A6A5C] no-underline transition-all duration-200 ${hovered ? "text-[#2D231F] gap-3" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={`text-[#2D231F]/35 text-base leading-none transition-transform duration-200 ${hovered ? "translate-x-0.5 text-[#2D231F]" : ""}`}
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
        className={`w-full h-13 px-5 text-sm text-[#7A6A5C] bg-[#F3EDE3]/60 border-[1.5px] border-[#2D231F]/25 rounded-xl sm:rounded-r-none outline-none transition-all sm:border-r-0
          ${focused ? "border-[#2D231F]/60 shadow-[0_0_0_3px_rgba(45, 35, 31,0.1),inset_0_0_20px_rgba(45, 35, 31,0.05)]" : ""}`}
      />
      <Button
        type="submit"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`h-13 px-8 bg-[#2D231F] bg-size-[200%] border-none rounded-xl sm:rounded-l-none text-[#F3EDE3] text-xs font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-lg ${hovered ? "bg-right shadow-xl scale-[1.02]" : ""}`}
      >
        {submitted ? "Đã gửi" : "Đăng ký"}
      </Button>
    </form>
  );
}

function NewsletterSection() {
  return (
    <div className="border-y border-[#D9CDBE] py-10 px-12 bg-[#EDE4D5] max-sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-4 flex-[1_1_300px]">
            <div className="w-12 h-12 rounded-full bg-[#EDE4D5] border-[1.5px] border-[#D9CDBE] flex items-center justify-center text-[#2D231F] shrink-0">
            <Mail size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-xl font-bold text-[#2D231F] mb-1.5">
              Đăng ký nhận tin
            </div>
            <p className="text-[13.5px] text-[#7A6A5C] m-0 leading-relaxed">
              Cập nhật mẫu thiệp mới và mẹo gửi thiệp cho khách mời
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
    <footer className="relative overflow-hidden flex flex-col bg-[linear-gradient(160deg,#F3EDE3_0%,#EDE4D5_35%,#EDE4D5_65%,#F3EDE3_100%)] font-inherit">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 15% 20%, rgba(45, 35, 31,0.07) 0%, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 85% 75%, rgba(45, 35, 31,0.05) 0%, transparent 70%),
                       radial-gradient(ellipse 30% 30% at 50% 50%, rgba(45, 35, 31,0.04) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-1 w-full h-0.5 shrink-0 bg-[linear-gradient(90deg,transparent_0%,#C4B09A_15%,#2D231F_40%,#C4B09A_50%,#2D231F_60%,#C4B09A_85%,transparent_100%)]" />

      <div className="relative z-1 flex items-center gap-4 px-12 pt-7 pb-5 max-sm:px-6">
        <span className="flex-1 h-px bg-[linear-gradient(90deg,transparent,rgba(45, 35, 31,0.35),transparent)]" />
        <span className="text-lg text-[#2D231F]/25 tracking-[6px] whitespace-nowrap">
          ❧ ✦ ❧
        </span>
        <span className="flex-1 h-px bg-[linear-gradient(90deg,transparent,rgba(45, 35, 31,0.35),transparent)]" />
      </div>

      <div className="relative z-1 grid grid-cols-[3fr_2fr_2fr] gap-12 max-w-342.5 mx-auto px-12 pb-12 w-full box-border max-lg:grid-cols-[1fr] max-lg:gap-8">
        <div>
          <h2 className="text-[2rem] font-extrabold leading-tight text-[#2D231F] m-0 mb-4 tracking-wide" style={{ fontFamily: "var(--font-heading), 'Playfair Display', serif" }}>
            InviGo
          </h2>
          <p className="text-[13px] text-[#7A6A5C] leading-relaxed m-0 mb-6 italic">
            Thiệp mời online cho cưới hỏi, sinh nhật, tốt nghiệp và sự kiện
            riêng. Chọn mẫu, điền nội dung, gửi link — khách xác nhận tham dự
            ngay trên thiệp.
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
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#EDE4D5] border border-[#D9CDBE] rounded-full max-w-fit">
            <span className="text-[11px] text-[#7A6A5C] whitespace-nowrap">
              Cưới hỏi · sinh nhật · sự kiện
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-[10.5px] font-bold tracking-[3px] uppercase text-[#2D231F] m-0 mb-5 flex items-center gap-2">
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
          <h3 className="text-[10.5px] font-bold tracking-[3px] uppercase text-[#2D231F] m-0 mb-5 flex items-center gap-2">
            Liên Hệ
          </h3>
          <div className="flex flex-col gap-3.5">
            {CONTACT_INFO.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="w-8.5 h-8.5 rounded-full bg-[#EDE4D5] border border-[#D9CDBE] flex items-center justify-center text-[#2D231F] shrink-0">
                  {c.icon}
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#7A6A5C] tracking-[1.5px] uppercase mb-0.5">
                    {c.label}
                  </div>
                  <div className="text-[13px] text-[#7A6A5C] leading-relaxed whitespace-pre-line">
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
        <p className="text-[12.5px] text-[#7A6A5C] m-0">
          Copyright © {currentYear}{" "}
          <span className="text-[#2D231F] text-xs font-semibold">InviGo</span>.
          Bảo lưu mọi quyền.
          <span className="block sm:inline sm:before:content-['·'] sm:before:mx-1.5">
            Emoji: Fluent UI Emoji (MIT), Twemoji (CC-BY)
          </span>
        </p>
        <div className="flex gap-7">
          {["Điều khoản sử dụng", "Chính sách bảo mật", "Cookie"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-[#7A6A5C] no-underline transition-colors hover:text-[#2D231F] relative"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 h-px bg-[#2D231F] transition-all duration-250 w-0 hover:w-full" />
              </a>
            ),
          )}
        </div>
      </div>

      <div className="relative z-1 w-full h-px shrink-0 bg-[linear-gradient(90deg,transparent_0%,#7A6A5C_20%,#2D231F_50%,#7A6A5C_80%,transparent_100%)]" />
    </footer>
  );
}
