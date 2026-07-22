"use client";

import Carousel from "@/components/ui/carousel/Carousel";
import CarouselItem from "@/components/ui/carousel/CarouselItem";
import {
  type IServicePlan,
  servicePlanService,
} from "@/services/service-plan.service";
import { Check, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

function PricingCard({
  plan,
  index,
}: {
  plan: IServicePlan;
  index: number;
}) {
  const isPopular =
    index === 1 ||
    (plan.name &&
      (plan.name.toLowerCase().includes("premium") ||
        plan.name.toLowerCase().includes("cao cấp")));

  return (
    <div
      className={`group relative h-full flex flex-col p-5 lg:p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden w-full text-left ${
        isPopular
          ? "bg-[#221019]/60 border-[#d4af37]/30 lg:border-[#d4af37] shadow-[0_15px_45px_rgba(34,16,25,0.6)]"
          : "bg-transparent border-[#d4af37]/10 lg:border-[#d4af37]/15 hover:border-[#d4af37]/30"
      }`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-md">
          <Sparkles size={10} fill="currentColor" />
          Bán chạy nhất
        </div>
      )}

      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none transition-opacity duration-500 ${isPopular ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />

      <div className="mb-4 pb-4 lg:mb-6 lg:pb-6 relative z-10 border-b border-[#d4af37]/10">
        <span className="text-[9px] lg:text-[10px] tracking-[3px] text-[#c9a98a]/50 font-bold uppercase block mb-1">
          {isPopular
            ? "PREMIUM EXPERIENCE"
            : index === 0
              ? "STARTER PLAN"
              : "ROYAL BESPOKE"}
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
            {Number(plan.priceVnd) === 0
              ? "Miễn phí"
              : `${Number(plan.priceVnd).toLocaleString("vi-VN")}đ`}
          </span>
          <span className="text-[11px] lg:text-xs text-[#c9a98a]/60 font-light">
            / {plan.durationDays ? `${plan.durationDays} ngày` : "Thanh toán 1 lần"}
          </span>
        </div>
        <p className="text-[11px] lg:text-[12px] text-[#c9a98a]/70 leading-relaxed font-light mt-3 lg:mt-4">
          Gói dịch vụ {plan.name} với đầy đủ tính năng ưu việt cho ngày cưới.
        </p>
      </div>

      <ul className="flex-1 space-y-2.5 lg:space-y-3.5 mb-6 lg:mb-8 relative z-10">
        <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light">
          <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
          <span>
            Tối đa {plan.maxGuests > 0 ? `${plan.maxGuests} khách mời` : "không giới hạn khách"}
          </span>
        </li>
        <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light">
          <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
          <span>
            Tối đa {plan.maxPhotos > 0 ? `${plan.maxPhotos} hình ảnh` : "không giới hạn ảnh"}
          </span>
        </li>
        <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light">
          <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
          <span>Sử dụng {plan.maxTemplates} mẫu thiệp</span>
        </li>
        {plan.hasAi && (
          <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light">
            <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
            <span>Tích hợp trợ lý trí tuệ nhân tạo AI</span>
          </li>
        )}
        {plan.hasAnalytics && (
          <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light">
            <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
            <span>Phân tích dữ liệu & Thống kê thông minh</span>
          </li>
        )}
        {plan.hasCustomSlug && (
          <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#c9a98a]/80 font-light">
            <Check size={13} className="text-[#d4af37] mt-0.5 shrink-0" />
            <span>Hỗ trợ Tên miền / Slug riêng tùy chỉnh</span>
          </li>
        )}
      </ul>

      <div className="mt-auto relative z-10">
        <Link
          href="/templates"
          className={`w-full py-3 rounded-lg text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center transition-all duration-300 ${
            isPopular
              ? "bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] shadow-[0_8px_24px_rgba(212,175,55,0.2)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)] hover:scale-[1.01]"
              : "bg-transparent border border-[#d4af37]/35 text-[#d4af37] hover:bg-[#d4af37]/5"
          }`}
        >
          {Number(plan.priceVnd) === 0 ? "Tạo thiệp miễn phí" : "Đăng ký gói ngay"}
        </Link>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [plans, setPlans] = useState<IServicePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    servicePlanService
      .getActivePlans()
      .then((apiPlans) => {
        setPlans(Array.isArray(apiPlans) ? apiPlans : []);
      })
      .catch((err) => {
        console.error("Error fetching service plans:", err);
        setPlans([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const safePlans = Array.isArray(plans) ? plans : [];

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

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 text-[#d4af37] animate-spin" />
          </div>
        ) : safePlans.length === 0 ? (
          <div className="text-center text-[#c9a98a]/70 text-sm py-12">
            Hiện chưa có gói dịch vụ nào.
          </div>
        ) : (
          <>
            <div className="hidden lg:grid grid-cols-3 gap-8 items-stretch max-w-275 mx-auto">
              {safePlans.map((plan, i) => (
                <ScrollReveal key={plan.id || i}>
                  <PricingCard plan={plan} index={i} />
                </ScrollReveal>
              ))}
            </div>

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
                {safePlans.map((plan, i) => (
                  <CarouselItem
                    key={plan.id || i}
                    gradient="transparent"
                    hoverEffect={false}
                    colors={{
                      accent: "#d4af37",
                      borderInactive: "rgba(212,175,55,0.15)",
                      shadowActive:
                        "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.15)",
                    }}
                  >
                    <PricingCard plan={plan} index={i} />
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
