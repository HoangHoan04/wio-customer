"use client";

import { Quote, Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  stars: number;
  avatar: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Khánh Duy & Mai Chi",
    role: "Đám cưới tháng 12/2025",
    text: "Ban đầu tụi mình khá lo lắng vì bạn bè ở xa rất nhiều. Nhưng nhờ thiệp cưới online của Tiệm, ai cũng trầm trồ khi bóc bao thư ảo. Đặc biệt là tính năng RSVP giúp tụi mình chốt chính xác danh sách bàn tiệc chỉ trong vài ngày.",
    stars: 5,
    avatar: "D",
  },
  {
    name: "Minh Trí & Phương Thảo",
    role: "Đám cưới tháng 02/2026",
    text: "Giao diện tinh tế, thao tác kéo thả cực kỳ dễ dàng. Tính năng tích hợp mã QR mừng cưới bo góc đồng bộ rất lịch sự, giúp bạn bè phương xa gửi lời chúc và quà mừng vô cùng tế nhị, nhanh chóng.",
    stars: 5,
    avatar: "T",
  },
  {
    name: "Hoàng Vương & Quỳnh Anh",
    role: "Đám cưới tháng 05/2026",
    text: "Từng dùng thử nhiều bên nhưng chỉ có ở đây mới mang lại cảm giác cao cấp thực sự. Nhạc nền tự động phát cùng cánh hoa bay lãng mạn vô cùng. Giao diện xem trên điện thoại mượt mà, sang trọng hết nấc!",
    stars: 5,
    avatar: "V",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className="py-28 px-6 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, #1b0a11 0%, #0f0608 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Chia sẻ từ các cặp đôi
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light tracking-wide leading-tight font-cormorant">
              <span className="tct-shimmer-text italic block">
                Khoảnh khắc trọn vẹn niềm vui
              </span>
            </h2>
            <div className="w-12 h-px bg-[#d4af37]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i}>
              <div
                className="group relative h-full flex flex-col p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #160a0f 0%, #0d0407 100%)",
                  borderColor: "rgba(212, 175, 55, 0.12)",
                }}
              >
                <Quote
                  className="absolute right-6 top-6 w-16 h-16 text-[#d4af37]/3 transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                  strokeWidth={1}
                />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(212,175,55,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex items-center gap-1 mb-6">
                  {Array(t.stars)
                    .fill(0)
                    .map((_, idx) => (
                      <Star
                        key={idx}
                        size={13}
                        className="text-[#d4af37] fill-[#d4af37]"
                      />
                    ))}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <p
                    className="text-[13.5px] text-[#c9a98a]/90 leading-relaxed italic mb-8"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t border-[#d4af37]/10 pt-5">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full border border-[#d4af37]/30 flex items-center justify-center p-0.5">
                        <div className="w-full h-full rounded-full bg-linear-to-br from-[#d4af37]/20 to-[#f5c842]/20 border border-[#d4af37]/40 flex items-center justify-center text-sm font-semibold text-[#f5c842] shadow-inner">
                          {t.avatar}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-xs text-[#f5e6d3] tracking-wider">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-[#c9a98a]/50 uppercase tracking-widest mt-1">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 border border-[#d4af37]/0 rounded-2xl transition-all duration-500 group-hover:border-[#d4af37]/25 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
