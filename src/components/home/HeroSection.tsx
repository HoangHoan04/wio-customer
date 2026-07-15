"use client";

import IPhoneMockup from "@/components/common/IphoneMockup";
import { Award, Heart, MailOpen, MapPin, Music, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, rgba(212,175,55,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(180,20,50,0.12) 0%, transparent 50%)`,
        }}
      />

      <div
        className="absolute pointer-events-none select-none"
        style={{
          right: "-80px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.025,
        }}
      >
        <Heart size={480} color="#d4af37" fill="#d4af37" />
      </div>

      <div
        className="tct-float absolute"
        style={{
          bottom: "15%",
          left: "8%",
          opacity: 0.08,
          animationDuration: "5s",
        }}
      >
        <Sparkles size={80} color="#d4af37" />
      </div>
      <div
        className="tct-float absolute"
        style={{
          top: "20%",
          right: "10%",
          opacity: 0.08,
          animationDuration: "6s",
          animationDelay: "1s",
        }}
      >
        <Award size={60} color="#d4af37" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:text-left lg:items-start">
            <div
              className="tct-hero-text inline-flex items-center gap-3 mb-7 text-[11px] tracking-[5px] uppercase text-[#d4af37]"
              style={{ opacity: 1 }}
            >
              <Heart size={16} className="text-[#d4af37]" fill="#d4af37" />
              <span>Nền tảng thiệp cưới thế hệ mới</span>
              <Heart size={16} className="text-[#d4af37]" fill="#d4af37" />
            </div>

            <h1
              className="tct-hero-text-2 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-tight mb-4  "
              style={{ opacity: 1 }}
            >
              <span className="tct-shimmer-text block">Tiệm Cưới Tân Thời</span>
            </h1>

            <p
              className="tct-hero-text-3 text-[clamp(1rem,1.5vw,1.25rem)] italic text-[#c9a98a] max-w-150 mb-2"
              style={{ opacity: 1 }}
            >
              Gửi trao lời mời tinh tế, tự động hóa danh sách khách mời (RSVP),
              tích hợp mừng cưới không tiền mặt.
            </p>

            <p
              className="tct-hero-text-3 text-[clamp(0.9rem,1.2vw,1.1rem)] text-[#c9a98a]/70 max-w-150 mb-8"
              style={{ opacity: 1 }}
            >
              Tạo thiệp cưới online độc bản chỉ trong 5 phút với kho giao diện
              chuẩn gu mỹ thuật cao cấp.
            </p>

            <div
              className="tct-hero-text-3 flex gap-4 justify-center lg:justify-start flex-wrap"
              style={{ opacity: 1 }}
            >
              <Link
                href="/templates"
                className="px-9 py-4 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] text-sm font-bold tracking-widest uppercase rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Thiết Kế Ngay
              </Link>
              <Link
                href="/user-manual"
                className="px-9 py-4 bg-transparent border-[1.5px] border-[#d4af37] text-[#d4af37] text-sm font-semibold tracking-widest uppercase rounded-md hover:bg-[rgba(212,175,55,0.1)] transition-all"
              >
                Xem Hướng Dẫn
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center min-h-150">
            <div
              className="relative"
              style={{
                width: "580px",
                height: "540px",
                perspective: "1200px",
              }}
            >
              <IPhoneMockup
                className="tct-phone-left"
                size="small"
                position={{ left: "60px", top: "100px" }}
                transform="rotateY(25deg) rotateX(5deg) rotateZ(-8deg) translateZ(-60px)"
              >
                <div
                  className="flex-1 flex flex-col p-4 justify-between h-full text-white"
                  style={{
                    background:
                      "linear-gradient(170deg, #2a1015 0%, #0f0608 100%)",
                  }}
                >
                  <div className="text-center mt-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#d4af37]   block mb-1">
                      Xác nhận tham dự
                    </span>
                    <h3 className="text-sm font-medium text-[#c9a98a]">
                      BẠN SẼ ĐẾN CHỨ?
                    </h3>
                  </div>

                  <div className="space-y-3 my-auto">
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#c9a98a]/70 block">
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        disabled
                        className="w-full bg-[#1b0a10] border border-[#d4af37]/20 rounded p-2 text-[11px] placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#c9a98a]/70 block">
                        Số người tham gia
                      </label>
                      <select
                        disabled
                        className="w-full bg-[#1b0a10] border border-[#d4af37]/20 rounded p-2 text-[11px] text-gray-500 focus:outline-none"
                      >
                        <option>Đi 1 mình</option>
                      </select>
                    </div>

                    <button
                      disabled
                      className="w-full py-2.5 bg-[#d4af37] text-[#0f0608] rounded text-xs font-bold uppercase tracking-wider mt-2"
                    >
                      Xác nhận tham dự (RSVP)
                    </button>
                    <button
                      disabled
                      className="w-full py-2 bg-transparent border border-[#d4af37]/30 text-white rounded text-[11px]"
                    >
                      Rất tiếc, tôi không thể đến
                    </button>
                  </div>

                  <div className="text-center text-[9px] text-[#c9a98a]/40 mb-4">
                    Cảm ơn bạn đã phản hồi sớm!
                  </div>
                </div>
              </IPhoneMockup>

              <IPhoneMockup
                className="tct-phone-right"
                size="small"
                position={{ right: "10px", top: "100px" }}
                transform="rotateY(-25deg) rotateX(5deg) rotateZ(8deg) translateZ(-60px)"
              >
                <div
                  className="flex-1 flex flex-col p-4 justify-between h-full text-white"
                  style={{
                    background:
                      "linear-gradient(170deg, #2a1015 0%, #0f0608 100%)",
                  }}
                >
                  <div className="text-center mt-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#d4af37]   block mb-1">
                      Gửi lời chúc & Mừng cưới
                    </span>
                    <h3 className="text-sm font-medium text-[#c9a98a]">
                      GỬI QUÀ MỪNG
                    </h3>
                  </div>

                  <div className="my-auto space-y-4">
                    <div className="bg-[#1b0a10] border border-[#d4af37]/10 p-2 rounded flex items-center gap-2">
                      <MapPin size={16} className="text-[#d4af37] shrink-0" />
                      <div className="text-[9px] text-left">
                        <p className="font-bold text-[#c9a98a]">
                          Nhà Hàng GEM Center
                        </p>
                        <p className="text-gray-400">
                          8 Nguyễn Bỉnh Khiêm, Quận 1
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg mx-auto w-24 h-24 flex items-center justify-center shadow-md relative group">
                      <div className="w-20 h-20 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                        <span className="text-[8px] text-gray-500 font-mono font-bold">
                          QR BANKING
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
                        <Heart
                          size={14}
                          className="text-rose-500 fill-rose-500 animate-pulse"
                        />
                      </div>
                    </div>
                    <p className="text-[9px] text-center text-[#c9a98a]/80 italic">
                      Cảm ơn những lời chúc mừng ngọt ngào nhất!
                    </p>
                  </div>

                  <div className="text-center text-[9px] text-[#c9a98a]/40 mb-4">
                    Tích hợp bản đồ & quét mã tiện lợi
                  </div>
                </div>
              </IPhoneMockup>

              <IPhoneMockup
                className="tct-phone-center"
                size="medium"
                position={{ left: "50%", top: "50px", marginLeft: "-80px" }}
                transform="rotateY(-5deg) rotateX(3deg) translateZ(40px)"
              >
                <div
                  className="flex-1 flex flex-col justify-between h-full text-white relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #1f0b11 0%, #441721 50%, #15060a 100%)",
                  }}
                >
                  <div className="h-[45%] w-full relative bg-gray-900 overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-80 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1f0b11] to-transparent" />
                  </div>

                  <div className="px-4 text-center z-10 -mt-6">
                    <span className="text-[9px] uppercase tracking-[4px] text-[#d4af37] font-medium block mb-2">
                      Trân trọng kính mời
                    </span>

                    <h2 className="text-lg   font-light text-white tracking-wide leading-tight">
                      Khánh Duy
                    </h2>
                    <span className="text-[#d4af37]   text-sm block my-1">
                      &
                    </span>
                    <h2 className="text-lg   font-light text-white tracking-wide leading-tight">
                      Mai Chi
                    </h2>

                    <div className="my-4 border-y border-[#d4af37]/20 py-2 flex justify-around text-center">
                      <div>
                        <p className="text-[7px] text-[#c9a98a] uppercase tracking-wider">
                          Ngày cưới
                        </p>
                        <p className="text-[10px] font-bold text-white">
                          20 . 12 . 2026
                        </p>
                      </div>
                      <div className="border-r border-[#d4af37]/20 h-5 my-auto" />
                      <div>
                        <p className="text-[7px] text-[#c9a98a] uppercase tracking-wider">
                          Địa điểm
                        </p>
                        <p className="text-[10px] font-bold text-white">
                          GEM Center
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 mb-6 z-10 space-y-2">
                    <button
                      disabled
                      className="w-full py-2 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                    >
                      <MailOpen size={12} />
                      Chạm để mở thiệp
                    </button>
                    <div className="flex justify-center gap-3 text-[9px] text-[#c9a98a]/60">
                      <span className="flex items-center gap-1">
                        <Music size={10} /> Nhạc nền
                      </span>
                      <span>•</span>
                      <span>Album ảnh cưới</span>
                    </div>
                  </div>
                </div>
              </IPhoneMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
