"use client";

import { Music, Palette, QrCode, Users } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface ServiceItem {
  number: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  desc: string;
}

export const SERVICES: ServiceItem[] = [
  {
    number: "I",
    icon: Palette,
    title: "Tuyệt tác Giao diện",
    subtitle: "BESPOKE DIGITAL THEME",
    desc: "Tùy chỉnh không giới hạn các mẫu thiết kế mang đậm dấu ấn mỹ thuật hoàng gia, từ font chữ Serif cổ điển đến hiệu ứng bóc bao thư 3D chân thực.",
  },
  {
    number: "II",
    icon: Music,
    title: "Khơi nguồn Cảm xúc",
    subtitle: "SENSORY AUDIO EXPERIENCE",
    desc: "Tích hợp nhạc nền lãng mạn tự động phát khi mở thiệp, kết hợp cùng hiệu ứng tuyết rơi, cánh hoa bay nhẹ nhàng chạm đến trái tim người nhận.",
  },
  {
    number: "III",
    icon: Users,
    title: "Quản trị Khách mời RSVP",
    subtitle: "INTELLIGENT RSVP SYSTEM",
    desc: "Hệ thống tự động ghi nhận phản hồi tham dự, đi cùng ai, lời chúc... thống kê chính xác số lượng bàn tiệc trên trang quản lý thời gian thực.",
  },
  {
    number: "IV",
    icon: QrCode,
    title: "Mừng cưới Tinh tế",
    subtitle: "ELEGANT GIFTING GATEWAY",
    desc: "Tích hợp mã QR tài khoản ngân hàng bo góc nghệ thuật đồng bộ với giao diện, giúp khách ở xa dễ dàng gửi lời chúc và quà mừng tế nhị.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Đặc quyền công nghệ số
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Trải Nghiệm Thiệp Cưới Thông Minh
              </span>
            </h2>
            <div className="w-12 h-px bg-[#d4af37]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {SERVICES.map((s, i) => {
            const IconComp = s.icon;
            return (
              <ScrollReveal key={i}>
                <div
                  className="group relative flex h-full flex-col p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, #160a0f 0%, #0d0407 100%)",
                    borderColor: "rgba(212, 175, 55, 0.12)",
                  }}
                >
                  <span
                    className="absolute -right-4 -top-8 text-[120px]   font-extralight text-[#d4af37]/2 transition-all duration-700 group-hover:text-[#d4af37]/5 select-none pointer-events-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.number}
                  </span>

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#221019] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] transition-all duration-500 group-hover:bg-[#d4af37] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      <IconComp size={20} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col relative z-10">
                    <span className="text-[9px] tracking-[3px] text-[#c9a98a]/50 font-bold uppercase block mb-1">
                      {s.subtitle}
                    </span>

                    <h3
                      className="text-lg font-medium tracking-wide text-white mb-3 transition-colors duration-300 group-hover:text-[#d4af37]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.title}
                    </h3>

                    <p className="text-[12.5px] text-[#c9a98a]/70 leading-relaxed font-light mt-auto">
                      {s.desc}
                    </p>
                  </div>

                  <div className="absolute inset-0 border border-[#d4af37]/0 rounded-2xl transition-all duration-500 group-hover:border-[#d4af37]/30 pointer-events-none" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
