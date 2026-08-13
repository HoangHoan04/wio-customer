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
          ? "bg-[#EDE4D5]/70 border-[#2D231F]/30 lg:border-[#2D231F] shadow-[0_15px_45px_rgba(45,35,31,0.12)]"
          : "bg-transparent border-[#2D231F]/10 lg:border-[#2D231F]/15 hover:border-[#2D231F]/30"
      }`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#2D231F] text-[#F3EDE3] text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-md">
          <Sparkles size={10} fill="currentColor" />
          Bán chạy nhất
        </div>
      )}

      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45, 35, 31,0.05)_0%,transparent_60%)] pointer-events-none transition-opacity duration-500 ${isPopular ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />

      <div className="mb-4 pb-4 lg:mb-6 lg:pb-6 relative z-10 border-b border-[#2D231F]/10">
        <span className="text-[9px] lg:text-[10px] tracking-[3px] text-[#7A6A5C]/50 font-bold uppercase block mb-1">
          {isPopular
            ? "Dùng nhiều nhất"
            : Number(plan.priceVnd) === 0
              ? "Bắt đầu miễn phí"
              : "Đầy đủ tính năng"}
        </span>
        <h3
          className="text-xl lg:text-2xl font-light text-[#2D231F] mb-2 lg:mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1.5 text-[#2D231F]">
          <span
            className="text-3xl lg:text-4xl font-light tracking-tight text-[#2D231F]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {Number(plan.priceVnd) === 0
              ? "Miễn phí"
              : `${Number(plan.priceVnd).toLocaleString("vi-VN")}đ`}
          </span>
          <span className="text-[11px] lg:text-xs text-[#7A6A5C]/60 font-light">
            / {plan.durationDays ? `${plan.durationDays} ngày` : "Thanh toán 1 lần"}
          </span>
        </div>
        <p className="text-[11px] lg:text-[12px] text-[#7A6A5C]/70 leading-relaxed font-light mt-3 lg:mt-4">
          {Number(plan.priceVnd) === 0
            ? "Tạo thiệp mời online cho cưới hỏi, sinh nhật, tốt nghiệp hay sự kiện riêng."
            : `Gói ${plan.name}: thêm khách, thêm ảnh, RSVP và gửi link thiệp cho mọi loại sự kiện.`}
        </p>
      </div>

      <ul className="flex-1 space-y-2.5 lg:space-y-3.5 mb-6 lg:mb-8 relative z-10">
        <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#7A6A5C]/80 font-light">
          <Check size={13} className="text-[#2D231F] mt-0.5 shrink-0" />
          <span>
            Tối đa {plan.maxGuests > 0 ? `${plan.maxGuests} khách mời` : "không giới hạn khách"}
          </span>
        </li>
        <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#7A6A5C]/80 font-light">
          <Check size={13} className="text-[#2D231F] mt-0.5 shrink-0" />
          <span>
            Tối đa {plan.maxPhotos > 0 ? `${plan.maxPhotos} hình ảnh` : "không giới hạn ảnh"}
          </span>
        </li>
        <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#7A6A5C]/80 font-light">
          <Check size={13} className="text-[#2D231F] mt-0.5 shrink-0" />
            <span>Tối đa {plan.maxTemplates} mẫu thiệp</span>
        </li>
        {plan.hasAi && (
          <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#7A6A5C]/80 font-light">
            <Check size={13} className="text-[#2D231F] mt-0.5 shrink-0" />
            <span>Trợ lý AI viết lời mời</span>
          </li>
        )}
        {plan.hasAnalytics && (
          <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#7A6A5C]/80 font-light">
            <Check size={13} className="text-[#2D231F] mt-0.5 shrink-0" />
            <span>Thống kê khách mời và RSVP</span>
          </li>
        )}
        {plan.hasCustomSlug && (
          <li className="flex items-start gap-2 text-[11px] lg:text-[12.5px] text-[#7A6A5C]/80 font-light">
            <Check size={13} className="text-[#2D231F] mt-0.5 shrink-0" />
            <span>Đường dẫn thiệp tùy chỉnh</span>
          </li>
        )}
      </ul>

      <div className="mt-auto relative z-10">
        <Link
          href="/templates"
          className={`w-full py-3 rounded-lg text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center transition-all duration-300 ${
            isPopular
              ? "bg-[#2D231F] text-[#F3EDE3] shadow-[0_8px_24px_rgba(45,35,31,0.2)] hover:shadow-[0_12px_32px_rgba(45,35,31,0.32)] hover:scale-[1.01]"
              : "bg-transparent border border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F] hover:text-[#F3EDE3]"
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
    <section className="py-28 px-6 relative overflow-hidden border-b border-[#2D231F]/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
              Bảng giá
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Gói phù hợp từng loại thiệp
              </span>
            </h2>
            <p className="text-xs text-[#7A6A5C]/70 max-w-125 mx-auto leading-relaxed mt-4 uppercase tracking-widest font-cormorant">
              Một gói dùng cho cưới hỏi, sinh nhật, tốt nghiệp và sự kiện khác
            </p>
            <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 text-[#2D231F] animate-spin" />
          </div>
        ) : safePlans.length === 0 ? (
          <div className="text-center text-[#7A6A5C]/70 text-sm py-12">
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
                  accent: "#2D231F",
                  buttonBg: "rgba(45, 35, 31, 0.95)",
                  buttonHoverBg: "rgba(45, 35, 31, 0.25)",
                  dotInactive: "rgba(45, 35, 31, 0.2)",
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
                      accent: "#2D231F",
                      borderInactive: "rgba(45, 35, 31,0.15)",
                      shadowActive:
                        "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(45, 35, 31,0.15)",
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
