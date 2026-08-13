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
    title: "Nhiều mẫu, nhiều loại thiệp",
    subtitle: "CƯỚI · SINH NHẬT · SỰ KIỆN",
    desc: "Chọn mẫu theo loại thiệp: cưới hỏi, sinh nhật, tốt nghiệp, thôi nôi, tân gia hay sự kiện riêng. Đổi chữ, ảnh, màu và hiệu ứng mở bao thư cho đúng dịp của bạn.",
  },
  {
    number: "II",
    icon: Music,
    title: "Nhạc nền khi mở thiệp",
    subtitle: "TỰ PHÁT THEO KHÔNG KHÍ",
    desc: "Gắn bài hát bạn chọn, tự phát khi khách mở thiệp. Thiệp cưới thêm trang trọng, thiệp sinh nhật thêm rộn ràng, thiệp tốt nghiệp thêm cảm xúc.",
  },
  {
    number: "III",
    icon: Users,
    title: "RSVP và danh sách khách",
    subtitle: "BIẾT AI ĐẾN, AI VẮNG",
    desc: "Khách xác nhận tham dự, số người đi cùng và gửi lời chúc ngay trên thiệp. Bạn theo dõi danh sách, xếp bàn nếu cần, xuất file theo thời gian thực.",
  },
  {
    number: "IV",
    icon: QrCode,
    title: "Quà mừng qua mã QR",
    subtitle: "CHUYỂN KHOẢN TINH TẾ",
    desc: "Đặt mã QR ngân hàng trên thiệp để khách ở xa gửi quà mừng tiện, tế nhị — cho đám cưới, sinh nhật hay bất kỳ sự kiện nào bạn mời.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-[radial-gradient(circle,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
              Thiệp mời online
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Một nền tảng, nhiều loại thiệp
              </span>
            </h2>
            <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-6" />
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
                      "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
                    borderColor: "rgba(45, 35, 31, 0.12)",
                  }}
                >
                  <span
                    className="absolute -right-4 -top-8 text-[120px]   font-extralight text-[#2D231F]/2 transition-all duration-700 group-hover:text-[#2D231F]/5 select-none pointer-events-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.number}
                  </span>

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45, 35, 31,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#EDE4D5] border border-[#2D231F]/20 flex items-center justify-center text-[#2D231F] transition-all duration-500 group-hover:bg-[#2D231F] group-hover:text-[#F3EDE3] group-hover:shadow-[0_0_20px_rgba(45, 35, 31,0.3)]">
                      <IconComp size={20} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col relative z-10">
                    <span className="text-[9px] tracking-[3px] text-[#7A6A5C]/50 font-bold uppercase block mb-1">
                      {s.subtitle}
                    </span>

                    <h3
                      className="text-lg font-medium tracking-wide text-[#2D231F] mb-3 transition-colors duration-300 group-hover:text-[#2D231F]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.title}
                    </h3>

                    <p className="text-[12.5px] text-[#7A6A5C]/70 leading-relaxed font-light mt-auto">
                      {s.desc}
                    </p>
                  </div>

                  <div className="absolute inset-0 border border-[#2D231F]/0 rounded-2xl transition-all duration-500 group-hover:border-[#2D231F]/30 pointer-events-none" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
