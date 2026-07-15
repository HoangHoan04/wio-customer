"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface StepItem {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
}

export const STEPS: StepItem[] = [
  {
    step: "01",
    title: "Khám phá ý tưởng",
    subtitle: "SELECT A THEME",
    desc: "Lựa chọn từ bộ sưu tập các mẫu thiệp cưới trực tuyến mang đậm hơi thở mỹ thuật đương đại và cổ điển.",
  },
  {
    step: "02",
    title: "Cá nhân hóa câu chuyện",
    subtitle: "CUSTOMIZE CONTENT",
    desc: "Dễ dàng thay đổi câu từ, hình ảnh, bài nhạc lãng mạn và sơ đồ định vị ngày chung đôi theo cách riêng của bạn.",
  },
  {
    step: "03",
    title: "Trải nghiệm hoàn mỹ",
    subtitle: "LIVE PREVIEW",
    desc: "Xem trước toàn bộ hiệu ứng mở bao thư, cánh hoa bay và giao diện nhạc nền mượt mà ngay trên điện thoại.",
  },
  {
    step: "04",
    title: "Gửi trao hạnh phúc",
    subtitle: "SHARE THE LOVE",
    desc: "Sao chép liên kết sang trọng gửi đến người thương qua các nền tảng mạng xã hội và tự động hóa danh sách RSVP.",
  },
];

export default function StepsSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden border-b border-[#d4af37]/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-24">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Quy trình giản đơn
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Khởi tạo lời mời chỉ trong năm phút
              </span>
            </h2>
            <p className="text-xs text-[#c9a98a]/70 max-w-125 mx-auto leading-relaxed mt-4 uppercase tracking-widest font-cormorant">
              Sở hữu tấm thiệp cưới trực tuyến sang trọng qua vài thao tác tinh
              tế
            </p>
            <div className="w-12 h-px bg-[#d4af37]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="relative max-w-275 mx-auto">
          <div className="absolute top-12 left-12 right-12 h-px border-t border-dashed border-[#d4af37]/20 hidden lg:block z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {STEPS.map((item, idx) => (
              <ScrollReveal key={item.step}>
                <div className="group flex flex-col items-center text-center px-4 relative">
                  <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[#d4af37]/15 transition-all duration-700 group-hover:scale-110 group-hover:border-[#d4af37]/40 pointer-events-none" />
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/20 transition-all duration-1000 group-hover:rotate-45 group-hover:border-[#d4af37]/60 pointer-events-none" />
                    <div
                      className="w-16 h-16 rounded-full bg-linear-to-b from-[#221019]/80 to-[#0f0608]/90 border border-[#d4af37]/30 flex items-center justify-center text-xl font-light text-[#f5c842] shadow-xl relative z-10 backdrop-blur-xs transition-transform duration-500 group-hover:scale-105"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', 'Playfair Display', serif",
                      }}
                    >
                      {item.step}
                    </div>
                  </div>

                  <span className="text-[9px] tracking-[3px] text-[#c9a98a]/40 font-bold uppercase block mb-1.5 transition-colors duration-300 group-hover:text-[#d4af37]">
                    {item.subtitle}
                  </span>

                  <h3
                    className="text-lg font-medium text-white mb-3 transition-colors duration-300 group-hover:text-[#f5c842]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#c9a98a]/70 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <div className="text-center mt-20">
            <Link
              href="/templates"
              className="group/btn inline-flex items-center gap-3 px-12 py-4 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] text-xs font-bold tracking-[0.2em] uppercase rounded-lg shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)] hover:scale-102 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1s_ease-in-out]" />

              <span className="relative z-10 flex items-center gap-2">
                Bắt đầu tạo thiệp ngay
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
                />
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
