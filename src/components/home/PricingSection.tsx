"use client";

import Carousel from "@/components/ui/carousel/Carousel";
import CarouselItem from "@/components/ui/carousel/CarouselItem";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: "Khởi Đầu",
    subtitle: "STARTER PLAN",
    price: "Miễn phí",
    period: "Trọn đời",
    desc: "Giải pháp hoàn hảo cho các đám cưới ấm cúng, tinh giản với các tính năng cơ bản.",
    features: [
      "Giao diện chuẩn di động (3 mẫu cơ bản)",
      "Tự chỉnh sửa thông tin & hình ảnh",
      "Bản đồ chỉ đường (Google Maps)",
      "Thời gian lưu trữ: 30 ngày",
      "Có chứa watermark hệ thống",
    ],
    ctaText: "Tạo thiệp miễn phí",
    ctaLink: "/templates",
  },
  {
    name: "Uyên Ương",
    subtitle: "PREMIUM EXPERIENCE",
    price: "199.000đ",
    period: "Thanh toán 1 lần",
    desc: "Gói dịch vụ được yêu thích nhất. Mở khóa toàn bộ đặc quyền công nghệ số không giới hạn.",
    features: [
      "Mở khóa toàn bộ 14+ mẫu cao cấp",
      "Hiệu ứng mở bao thư & sáp nến ảo",
      "Tự động phát nhạc nền (Tải tệp riêng)",
      "Xác nhận tham dự RSVP thông minh",
      "Tích hợp mã QR mừng cưới tinh tế",
      "Không chứa watermark thương hiệu",
      "Thời gian lưu trữ: Vĩnh viễn",
    ],
    ctaText: "Trải nghiệm Premium",
    ctaLink: "/templates",
    isPopular: true,
  },
  {
    name: "Hoàng Gia",
    subtitle: "ROYAL BESPOKE",
    price: "Liên hệ",
    period: "Thiết kế riêng",
    desc: "Dành riêng cho các cặp đôi mong muốn một tác phẩm độc bản vẽ riêng bởi đội ngũ nghệ nhân số.",
    features: [
      "Thiết kế giao diện độc quyền theo yêu cầu",
      "Vẽ minh họa chân dung cô dâu chú rể",
      "Hỗ trợ custom tên miền riêng dạng: duy-chi.com",
      "Hệ thống RSVP & Album ảnh dung lượng lớn",
      "Hỗ trợ chỉnh sửa kỹ thuật 24/7",
    ],
    ctaText: "Đặt thiết kế riêng",
    ctaLink: "/contact",
  },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`group relative h-full flex flex-col p-5 lg:p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden w-full text-left ${
        plan.isPopular
          ? "bg-[#221019]/60 border-[#d4af37]/30 lg:border-[#d4af37] shadow-[0_15px_45px_rgba(34,16,25,0.6)]"
          : "bg-transparent border-[#d4af37]/10 lg:border-[#d4af37]/15 hover:border-[#d4af37]/30"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-md">
          <Sparkles size={10} fill="currentColor" />
          Bán chạy nhất
        </div>
      )}

      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none transition-opacity duration-500 ${plan.isPopular ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />

      <div className="mb-4 pb-4 lg:mb-6 lg:pb-6 relative z-10 border-b border-[#d4af37]/10">
        <span className="text-[9px] lg:text-[10px] tracking-[3px] text-[#c9a98a]/50 font-bold uppercase block mb-1">
          {plan.subtitle}
        </span>
        <h3
          className="text-xl lg:text-2xl font-light text-white mb-2 lg:mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1.5 text-white">
          <span
            className="text-3xl lg:text-4xl font-light tracking-tight text-[#f5c842]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {plan.price}
          </span>
          <span className="text-[11px] lg:text-xs text-[#c9a98a]/60 font-light">
            / {plan.period}
          </span>
        </div>
        <p className="text-[11px] lg:text-[12px] text-[#c9a98a]/70 leading-relaxed font-light mt-3 lg:mt-4">
          {plan.desc}
        </p>
      </div>

      <ul className="flex-1 space-y-2.5 lg:space-y-3.5 mb-6 lg:mb-8 relative z-10">
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light"
          >
            <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto relative z-10">
        <Link
          href={plan.ctaLink}
          className={`w-full py-3 rounded-lg text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center transition-all duration-300 ${
            plan.isPopular
              ? "bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] shadow-[0_8px_24px_rgba(212,175,55,0.2)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)] hover:scale-[1.01]"
              : "bg-transparent border border-[#d4af37]/35 text-[#d4af37] hover:bg-[#d4af37]/5"
          }`}
        >
          {plan.ctaText}
        </Link>
      </div>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden border-b border-[#d4af37]/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Bảng giá dịch vụ
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Đặc quyền thăng hoa ngày chung đôi
              </span>
            </h2>
            <div className="w-12 h-px bg-[#d4af37]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        {/* Desktop grid layout */}
        <div className="hidden lg:grid grid-cols-3 gap-8 items-stretch max-w-275 mx-auto">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={i}>
              <PricingCard plan={plan} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile carousel layout */}
        <div className="lg:hidden w-full">
          <Carousel
            colors={{
              accent: "#d4af37",
              buttonBg: "rgba(26, 10, 15, 0.95)",
              buttonHoverBg: "rgba(212, 175, 55, 0.25)",
              dotInactive: "rgba(212, 175, 55, 0.2)",
            }}
            sizes={{
              itemWidth: "290px",
              itemHeight: "560px",
              minHeight: "620px",
              trackHeight: "570px",
            }}
          >
            {PLANS.map((plan, i) => (
              <CarouselItem
                key={i}
                gradient="transparent"
                hoverEffect={false}
                colors={{
                  accent: "#d4af37",
                  borderInactive: "rgba(212,175,55,0.15)",
                  shadowActive:
                    "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.15)",
                }}
              >
                <PricingCard plan={plan} />
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
