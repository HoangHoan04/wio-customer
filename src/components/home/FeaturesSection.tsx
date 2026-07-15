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

export default function FeaturesSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const STEPS: StepItem[] = [
    {
      id: 1,
      icon: Mail,
      title: "Cánh Thư Chạm Cảm Xúc",
      subtitle: "HIỆU ỨNG MỞ BAO THƯ (ENVELOPE OPENING)",
      desc: "Khách mời sẽ không nhận một đường link vô hồn. Thay vào đó là trải nghiệm mở phong bì sáp nến ảo, rút thiệp cưới ra một cách chân thực và đầy trân trọng.",
      mockupView: (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-radial from-[#25101a] to-[#0d0407] relative overflow-hidden">
          <div className="w-40 h-28 bg-[#d4af37]/10 border-2 border-[#d4af37]/30 rounded-lg relative flex items-center justify-center shadow-2xl animate-pulse">
            <div className="absolute top-0 inset-x-0 h-1/2 bg-[#d4af37]/5 border-b border-[#d4af37]/20 rounded-t-lg transform origin-top -rotate-x-12" />
            <div className="w-8 h-8 rounded-full bg-rose-700/80 border border-rose-500 flex items-center justify-center shadow-md relative z-10">
              <span className="text-[10px] text-white">♥</span>
            </div>
          </div>
          <span className="text-[11px] text-[#c9a98a] mt-6 tracking-widest uppercase  ">
            Chạm để mở bao thư
          </span>
        </div>
      ),
    },
    {
      id: 2,
      icon: Music,
      title: "Giai Điệu Tình Yêu Khởi Sắc",
      subtitle: "BẢN KHÁT CA DÀNH RIÊNG CHO BẠN",
      desc: "Chèn bản nhạc yêu thích của hai bạn tự động phát khi thiệp mở ra. Kết hợp cùng hiệu ứng cánh hoa rơi nhẹ nhàng, tạo không gian lãng mạn ngay khi chạm mắt.",
      mockupView: (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#190810] relative overflow-hidden">
          <div
            className="relative w-32 h-32 rounded-full border border-[#d4af37]/40 p-1 animate-spin"
            style={{ animationDuration: "12s" }}
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#190810]" />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-[#d4af37]   text-sm">Perfect - Ed Sheeran</p>
            <p className="text-[10px] text-[#c9a98a]/60 uppercase tracking-widest mt-1">
              Đang phát tự động
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      icon: Users,
      title: "RSVP – Quên Đi Nỗi Lo Chốt Khách",
      subtitle: "TỰ ĐỘNG HÓA SỐ LƯỢNG BÀN TIỆC",
      desc: "Khách mời dễ dàng chọn tham dự, đi cùng ai, hay nhắn gửi lời chúc. Hệ thống tự động thống kê số lượng bàn tiệc và xuất file danh sách thời gian thực cho bạn.",
      mockupView: (
        <div className="flex flex-col p-5 justify-between h-full bg-[#12050b]">
          <div className="text-center mt-4">
            <span className="text-[9px] uppercase tracking-wider text-[#d4af37]   block mb-1">
              Hệ Thống Phản Hồi
            </span>
            <h4 className="text-xs font-semibold text-white">
              XÁC NHẬN THAM GIA
            </h4>
          </div>
          <div className="space-y-2.5 my-auto">
            <div className="bg-[#1b0a10] border border-[#d4af37]/20 rounded p-2 text-left">
              <p className="text-[8px] text-[#c9a98a]/60">Khách mời</p>
              <p className="text-[11px] text-white font-medium">
                Hoàng Vương & Bạn bè
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-[#d4af37] text-black py-2 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Check size={10} /> Sẽ Đến
              </button>
              <button className="bg-transparent border border-white/20 text-white/60 py-2 rounded text-[10px]">
                Rất tiếc
              </button>
            </div>
          </div>
          <p className="text-[9px] text-center text-[#c9a98a]/40 pb-4">
            Tự động điền dữ liệu vào Dashboard
          </p>
        </div>
      ),
    },
    {
      id: 4,
      icon: Landmark,
      title: "Mừng Cưới Không Tiền Mặt Tinh Tế",
      subtitle: "MÃ QR BANKING ĐỒNG BỘ THIẾT KẾ",
      desc: "Mã QR chuyển khoản và hộp gửi lời chúc được đặt trang trọng ở cuối thiệp. Khách ở xa vẫn có thể gửi gắm tình cảm và quà mừng một cách thuận tiện, tế nhị.",
      mockupView: (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#1c0b12]">
          <span className="text-[10px] text-[#d4af37] tracking-widest uppercase   mb-4 block">
            Hộp mừng cưới
          </span>
          <div className="p-3 bg-white rounded-xl shadow-lg relative mb-4">
            <div className="w-20 h-20 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
              <span className="text-[8px] text-gray-500 font-mono font-bold">
                QR CODE
              </span>
            </div>
            <div className="absolute inset-0 bg-[#d4af37]/10 rounded-xl pointer-events-none" />
          </div>
          <p className="text-xs text-[#c9a98a] font-medium">
            Ngân hàng Quân Đội (MB)
          </p>
          <p className="text-[10px] text-white/50 mt-1">Số TK: 1900xxxxxx</p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden border-b border-[#d4af37]/10">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.03)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-300 mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-24">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Trải nghiệm thế hệ mới
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light  font-cormorant leading-tight">
              <span className="tct-shimmer-text italic block">
                Không Chỉ Là Thiệp, Đó Là Một Hành Trình
              </span>
            </h2>
            <p className="text-xs text-[#c9a98a]/70 max-w-125 mx-auto leading-relaxed mt-4 uppercase tracking-widest font-cormorant">
              Khám phá cách chúng tôi thay đổi cách gửi lời mời đám cưới của bạn
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
          <div className="w-full lg:w-[42%] flex items-center justify-center lg:sticky lg:top-24 h-120 lg:h-145 self-start z-20">
            <div className="relative w-65 h-130 transformStyle-3d transform rotateY(-6deg) rotateX(4deg) transition-transform duration-500">
              <div
                className="absolute inset-0 rounded-[40px] p-1.5 shadow-[15px_25px_60px_rgba(0,0,0,0.8)]"
                style={{
                  background:
                    "linear-gradient(145deg, #221019 0%, #0d0407 100%)",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                }}
              >
                <div className="w-full h-full rounded-[34px] overflow-hidden bg-black relative transition-all duration-700">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800" />
                  </div>

                  <div className="w-full h-full transition-all duration-500 ease-out pt-6">
                    {STEPS.find((step) => step.id === activeStep)?.mockupView}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[58%] flex flex-col justify-center gap-6">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const IconComp = step.icon;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-500 group relative ${
                    isActive
                      ? "bg-[#221019]/60 border-[#d4af37] shadow-[0_10px_30px_rgba(34,16,25,0.4)]"
                      : "bg-transparent border-[#d4af37]/10 hover:border-[#d4af37]/30 hover:bg-white/1"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-[#d4af37] transition-transform duration-500 origin-top ${
                      isActive ? "scale-y-100" : "scale-y-0"
                    }`}
                  />

                  <div className="flex items-start gap-5">
                    <div
                      className={`p-3.5 rounded-xl transition-all duration-500 ${
                        isActive
                          ? "bg-[#d4af37] text-[#0f0608]"
                          : "bg-[#221019] text-[#c9a98a]/70 group-hover:text-[#d4af37]"
                      }`}
                    >
                      <IconComp
                        size={22}
                        className={isActive ? "animate-pulse" : ""}
                      />
                    </div>

                    <div className="flex-1">
                      <span
                        className={`text-[9px] font-bold tracking-[2px] uppercase block mb-1.5 transition-colors ${
                          isActive ? "text-[#d4af37]" : "text-[#c9a98a]/50"
                        }`}
                      >
                        {step.subtitle}
                      </span>

                      <h3
                        className={`text-xl font-medium italic tracking-wide mb-2 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-[#f5e6d3]/80 group-hover:text-[#d4af37]"
                        }`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {step.title}
                      </h3>

                      <div
                        className={`transition-all duration-500 overflow-hidden ${
                          isActive
                            ? "max-h-40 opacity-100 mt-3"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-xs text-[#c9a98a] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`my-auto text-[#c9a98a]/40 transition-transform duration-500 ${
                        isActive
                          ? "translate-x-1 text-[#d4af37]"
                          : "group-hover:translate-x-1"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
