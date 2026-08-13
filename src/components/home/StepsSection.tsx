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
    title: "Chọn loại thiệp và mẫu",
    subtitle: "CƯỚI · SINH NHẬT · SỰ KIỆN",
    desc: "Chọn loại thiệp phù hợp — cưới hỏi, sinh nhật, tốt nghiệp, thôi nôi, tân gia hoặc sự kiện riêng — rồi lấy một mẫu làm điểm bắt đầu.",
  },
  {
    step: "02",
    title: "Điền nội dung của bạn",
    subtitle: "CHỮ · ẢNH · NHẠC",
    desc: "Sửa lời mời, ảnh, nhạc nền, địa điểm và thời gian. Thiệp hiện đúng câu chuyện của bạn, không phải nội dung mẫu.",
  },
  {
    step: "03",
    title: "Xem trước trên điện thoại",
    subtitle: "XEM NHƯ KHÁCH MỜI",
    desc: "Mở thử hiệu ứng bao thư, nhạc nền và từng trang thiệp trên điện thoại trước khi gửi cho khách.",
  },
  {
    step: "04",
    title: "Xuất bản và gửi link",
    subtitle: "CHIA SẺ · RSVP",
    desc: "Sao chép đường dẫn thiệp gửi Zalo, Messenger hay mạng xã hội. Khách xác nhận tham dự, bạn theo dõi danh sách trên hệ thống.",
  },
];

export default function StepsSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden border-b border-[#2D231F]/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-24">
            <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
              Làm thiệp trong vài bước
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Từ mẫu có sẵn đến thiệp đã gửi
              </span>
            </h2>
            <p className="text-xs text-[#7A6A5C]/70 max-w-125 mx-auto leading-relaxed mt-4 uppercase tracking-widest font-cormorant">
              Chọn mẫu, điền nội dung, xem trước rồi gửi link cho khách mời
            </p>
            <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="relative max-w-275 mx-auto">
          <div className="absolute top-12 left-12 right-12 h-px border-t border-dashed border-[#2D231F]/20 hidden lg:block z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {STEPS.map((item) => (
              <ScrollReveal key={item.step}>
                <div className="group flex flex-col items-center text-center px-4 relative">
                  <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[#2D231F]/15 transition-all duration-700 group-hover:scale-110 group-hover:border-[#2D231F]/40 pointer-events-none" />
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#2D231F]/20 transition-all duration-1000 group-hover:rotate-45 group-hover:border-[#2D231F]/60 pointer-events-none" />
                    <div
                      className="w-16 h-16 rounded-full bg-linear-to-b from-[#EDE4D5]/80 to-[#F3EDE3]/90 border border-[#2D231F]/30 flex items-center justify-center text-xl font-light text-[#7A6A5C] shadow-xl relative z-10 backdrop-blur-xs transition-transform duration-500 group-hover:scale-105"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', 'Playfair Display', serif",
                      }}
                    >
                      {item.step}
                    </div>
                  </div>

                  <span className="text-[9px] tracking-[3px] text-[#7A6A5C]/40 font-bold uppercase block mb-1.5 transition-colors duration-300 group-hover:text-[#2D231F]">
                    {item.subtitle}
                  </span>

                  <h3
                    className="text-lg font-medium text-[#2D231F] mb-3 transition-colors duration-300 group-hover:text-[#7A6A5C]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#7A6A5C]/70 leading-relaxed font-light">
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
              className="group/btn inline-flex items-center gap-3 px-12 py-4 bg-[#2D231F] text-[#F3EDE3] text-xs font-bold tracking-[0.2em] uppercase rounded-lg shadow-[0_10px_30px_rgba(45,35,31,0.15)] hover:shadow-[0_15px_40px_rgba(45,35,31,0.28)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-[#2D231F]/80 transform -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1s_ease-in-out]" />

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
