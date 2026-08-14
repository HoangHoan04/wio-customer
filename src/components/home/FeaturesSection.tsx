"use client";

import {
  Check,
  ChevronRight,
  Landmark,
  Mail,
  Music,
  Users,
} from "lucide-react";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface StepItem {
  id: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  desc: string;
  mockupView: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    icon: Mail,
    title: "Mở thiệp như mở phong bì thật",
    subtitle: "Hiệu ứng mở bao thư",
    desc: "Khách mời không nhận một đường link khô khan. Họ mở phong bì ảo rồi rút thiệp ra — cho cưới hỏi, sinh nhật, tốt nghiệp, tân gia hay bất kỳ dịp nào bạn tổ chức.",
    mockupView: (
      <div className="flex h-full flex-col items-center justify-center overflow-hidden bg-[#EDE4D5] p-4 text-center">
        <div className="relative flex h-28 w-40 items-center justify-center border border-[#2D231F]/25 bg-[#F3EDE3] shadow-[0_12px_24px_rgba(45,35,31,0.08)]">
          <div className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-lg border-b border-[#2D231F]/20 bg-[#2D231F]/5" />
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#2D231F]">
            <span className="text-[10px] text-[#F3EDE3]">♥</span>
          </div>
        </div>
        <span className="mt-6 text-[11px] uppercase tracking-widest text-[#7A6A5C]">
          Chạm để mở bao thư
        </span>
      </div>
    ),
  },
  {
    id: 2,
    icon: Music,
    title: "Nhạc nền đúng không khí buổi tiệc",
    subtitle: "Tự phát khi mở thiệp",
    desc: "Gắn bài hát bạn chọn, tự phát khi khách mở thiệp. Một bản nhạc đủ để thiệp cưới thêm trang trọng, thiệp sinh nhật thêm rộn ràng, hay thiệp tốt nghiệp thêm cảm xúc.",
    mockupView: (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#F3EDE3] p-6 text-center">
        <div
          className="relative h-32 w-32 animate-spin rounded-full border border-[#2D231F]/30 p-1"
          style={{ animationDuration: "12s" }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#2A211C]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C4B09A]/50 bg-[#C4B09A]/30">
              <div className="h-3 w-3 rounded-full bg-[#F3EDE3]" />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-[#2D231F]">Perfect - Ed Sheeran</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-[#7A6A5C]/60">
            Đang phát tự động
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: Users,
    title: "RSVP — biết ai đến, ai vắng",
    subtitle: "Xác nhận tham dự tự động",
    desc: "Khách chọn tham dự, số người đi cùng và gửi lời chúc ngay trên thiệp. Bạn theo dõi danh sách, xếp bàn nếu cần, và xuất file theo thời gian thực — không phải nhắn từng người.",
    mockupView: (
      <div className="flex h-full flex-col justify-between bg-[#2A211C] p-5">
        <div className="mt-4 text-center">
          <span className="mb-1 block text-[9px] uppercase tracking-wider text-[#F3EDE3]/70">
            Hệ thống phản hồi
          </span>
          <h4 className="text-xs font-semibold text-[#F3EDE3]">
            XÁC NHẬN THAM GIA
          </h4>
        </div>
        <div className="my-auto space-y-2.5">
          <div className="border-b border-[#F3EDE3]/20 p-2 text-left">
            <p className="text-[8px] text-[#F3EDE3]/50">Khách mời</p>
            <p className="text-[11px] font-medium text-[#F3EDE3]">
              Minh Anh & gia đình
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="flex items-center justify-center gap-1 bg-[#F3EDE3] py-2 text-[10px] font-bold uppercase tracking-wider text-[#2D231F]">
              <Check size={10} /> Sẽ đến
            </span>
            <span className="border border-[#F3EDE3]/25 py-2 text-center text-[10px] text-[#F3EDE3]/70">
              Rất tiếc
            </span>
          </div>
        </div>
        <p className="pb-4 text-center text-[9px] text-[#F3EDE3]/40">
          Tự động điền dữ liệu vào Dashboard
        </p>
      </div>
    ),
  },
  {
    id: 4,
    icon: Landmark,
    title: "Gửi quà mừng qua mã QR",
    subtitle: "Chuyển khoản tinh tế",
    desc: "Đặt mã QR ngân hàng và lời chúc ngay trên thiệp. Khách ở xa vẫn gửi quà mừng tiện, tế nhị — cho đám cưới, sinh nhật hay bất kỳ sự kiện nào bạn mời.",
    mockupView: (
      <div className="flex h-full flex-col items-center justify-center bg-[#F3EDE3] p-6 text-center">
        <span className="mb-4 block text-[10px] uppercase tracking-widest text-[#7A6A5C]">
          Hộp quà mừng
        </span>
        <div className="relative mb-4 rounded-sm border border-[#D9CDBE] bg-white p-3 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center border border-[#2D231F]/20 bg-[#EDE4D5]">
            <span className="font-mono text-[8px] font-bold text-[#7A6A5C]">
              QR CODE
            </span>
          </div>
        </div>
        <p className="text-xs font-medium text-[#2D231F]">
          Ngân hàng Quân Đội (MB)
        </p>
        <p className="mt-1 text-[10px] text-[#7A6A5C]">Số TK: 1900xxxxxx</p>
      </div>
    ),
  },
];

function PhonePreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-105 w-52.5 shrink-0 sm:h-120 sm:w-60">
      <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-[#2D231F]/15 bg-[#F3EDE3] shadow-[0_20px_40px_rgba(45,35,31,0.14)]">
        <div className="h-full w-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const [activeStep, setActiveStep] = useState(1);
  const active = STEPS.find((step) => step.id === activeStep) ?? STEPS[0];

  return (
    <section className="relative overflow-hidden border-b border-[#2D231F]/10 px-6 py-24">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(45,35,31,0.03)_0%,transparent_60%)]" />

      <div className="mx-auto max-w-300">
        <ScrollReveal>
          <div className="mb-16 text-center lg:mb-20">
            <p className="mb-4 font-cormorant text-xs font-semibold uppercase tracking-[6px] text-[#7A6A5C]">
              Trải nghiệm thế hệ mới
            </p>
            <h2 className="font-cormorant text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight">
              <span className="tct-shimmer-text block italic">
                Thiệp online cho mọi dịp vui
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-125 font-cormorant text-xs uppercase leading-relaxed tracking-widest text-[#7A6A5C]/70">
              Thiệp mời online cho cưới hỏi, sinh nhật, tốt nghiệp và nhiều dịp
              vui khác
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:gap-16">
          <div className="flex justify-center lg:sticky lg:top-28 lg:w-[42%] lg:self-start">
            <PhonePreview>{active.mockupView}</PhonePreview>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-[58%]">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const IconComp = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-colors duration-300 ${
                    isActive
                      ? "border-[#2D231F] bg-[#EDE4D5] shadow-[0_8px_24px_rgba(45,35,31,0.08)]"
                      : "border-[#2D231F]/12 bg-transparent hover:border-[#2D231F]/30 hover:bg-[#EDE4D5]/40"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-0.75 bg-[#2D231F] transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="flex items-start gap-4 p-5 sm:gap-5 sm:p-6">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isActive
                          ? "bg-[#2D231F] text-[#F3EDE3]"
                          : "bg-[#EDE4D5] text-[#7A6A5C] group-hover:text-[#2D231F]"
                      }`}
                    >
                      <IconComp size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`mb-1 block text-[10px] font-semibold uppercase tracking-[1.6px] ${
                          isActive ? "text-[#2D231F]" : "text-[#7A6A5C]/70"
                        }`}
                      >
                        {step.subtitle}
                      </span>
                      <h3
                        className="font-heading text-lg font-medium tracking-wide text-[#2D231F] sm:text-xl"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {step.title}
                      </h3>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="pt-3 text-xs leading-relaxed text-[#7A6A5C]">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`mt-3 shrink-0 transition-transform duration-300 ${
                        isActive
                          ? "translate-x-0.5 text-[#2D231F]"
                          : "text-[#7A6A5C]/40 group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
