"use client";

import ScrollReveal from "@/components/home/ScrollReveal";
import { ArrowRight, Award, Heart, Sparkles, Users } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Heart,
    title: "Tuyệt tác mỹ thuật",
    subtitle: "AESTHETIC ESSENCE",
    desc: "Mỗi mẫu thiết kế là kết quả của sự chắt lọc tinh tế từ xu hướng tối giản phương Tây hòa quyện cùng nét kiêu sa truyền thống Á Đông.",
  },
  {
    icon: Sparkles,
    title: "Cá nhân hóa tối đa",
    subtitle: "BESPOKE CONFIGURATION",
    desc: "Thay đổi toàn bộ giao diện từ màu sắc chủ đạo, hệ thống font chữ, nhạc nền du dương đến hiệu ứng chuyển động bóc bao thư sống động.",
  },
  {
    icon: Users,
    title: "Vận hành thông minh",
    subtitle: "SMART DIGITAL MANAGEMENT",
    desc: "Hệ thống tự động hóa phản hồi tham dự (RSVP), tích hợp mừng cưới tinh tế, giúp bạn thảnh thơi tận hưởng trọn vẹn ngày vui.",
  },
  {
    icon: Award,
    title: "Đồng hành tận tụy",
    subtitle: "ROYAL PATRONAGE",
    desc: "Hân hạnh đồng hành cùng hàng ngàn đôi uyên ương với sự chăm sóc chu đáo nhất từ đội ngũ hỗ trợ kỹ thuật số 24/7.",
  },
];

const STATS = [
  { number: "10k+", label: "Cặp đôi tin dùng", subtitle: "HAPPY COUPLES" },
  {
    number: "50+",
    label: "Tuyệt tác thiệp cưới",
    subtitle: "EXCLUSIVE TEMPLATES",
  },
  { number: "99%", label: "Tỷ lệ hài lòng", subtitle: "SATISFACTION RATE" },
  { number: "24/7", label: "Hỗ trợ tận tâm", subtitle: "LIVE ASSISTANCE" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-35 bg-[#F3EDE3] text-[#2D231F] overflow-x-hidden relative">
      <div className="absolute top-[10%] left-1/4 w-150 h-150 bg-[radial-gradient(circle,rgba(45, 35, 31,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[30%] right-1/4 w-125 h-125 bg-[radial-gradient(circle,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <section className="relative px-6 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
              Câu chuyện InviGo
            </p>
            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light font-cormorant mb-6 leading-tight text-[#2D231F]">
              <span className="tct-shimmer-text italic block">
                Nơi khởi đầu của hành trình vĩnh cửu
              </span>
            </h1>
            <p
              className="text-[clamp(1.1rem,1.8vw,1.35rem)] italic text-[#7A6A5C] max-w-3xl mx-auto leading-relaxed mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              &ldquo;Một cánh thư mời tinh tế không chỉ mang theo thông tin tiệc
              cưới, mà còn là lời gửi gắm trân trọng đầu tiên của đôi uyên ương
              đến những người thương mến.&rdquo;
            </p>
            <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-8" />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 px-6 relative z-10 border-t border-[#2D231F]/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
            <ScrollReveal>
              <div
                className="p-10 rounded-2xl border text-left relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
                  borderColor: "rgba(45, 35, 31, 0.15)",
                }}
              >
                <span
                  className="text-[120px] font-serif font-extralight text-[#2D231F]/2 absolute -right-6 -top-12 select-none pointer-events-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  M
                </span>
                <p className="text-[10px] tracking-[4px] uppercase text-[#7A6A5C] font-semibold mb-3">
                  Sứ mệnh của InviGo
                </p>
                <h2
                  className="text-2xl font-light text-[#2D231F] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Kết nối yêu thương bằng công nghệ tinh xảo
                </h2>
                <p className="text-[13px] text-[#7A6A5C]/80 leading-relaxed font-light">
                  Chúng tôi sinh ra để định nghĩa lại khái niệm thiệp cưới trực
                  tuyến. Không còn là những đường liên kết khô khan, mỗi tác
                  phẩm tại InviGo là một trải nghiệm chạm sâu sắc
                  vào giác quan người nhận, giúp ngày vui của bạn lưu giữ dấu ấn
                  hoàn mỹ nhất.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((f, i) => {
                const IconComp = f.icon;
                return (
                  <ScrollReveal key={i}>
                    <div
                      className="group relative h-full flex flex-col p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
                        borderColor: "rgba(45, 35, 31, 0.1)",
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45, 35, 31,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                      <div className="w-10 h-10 rounded-lg bg-[#EDE4D5] border border-[#2D231F]/25 flex items-center justify-center text-[#2D231F] mb-5 transition-all duration-500 group-hover:bg-[#2D231F] group-hover:text-[#F3EDE3]">
                        <IconComp size={18} strokeWidth={1.5} />
                      </div>

                      <span className="text-[9px] tracking-[2px] text-[#7A6A5C]/40 font-bold uppercase block mb-1">
                        {f.subtitle}
                      </span>
                      <h3
                        className="text-base font-medium text-[#2D231F] mb-2 group-hover:text-[#2D231F] transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-[12px] text-[#7A6A5C]/70 leading-relaxed font-light">
                        {f.desc}
                      </p>

                      <div className="absolute inset-0 border border-[#2D231F]/0 rounded-2xl transition-all duration-500 group-hover:border-[#2D231F]/25 pointer-events-none" />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-[#2D231F]/10 bg-[radial-gradient(circle_at_center,rgba(45, 35, 31,0.01)_0%,transparent_100%)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((s, i) => (
              <ScrollReveal key={i}>
                <div className="text-center group p-6 relative">
                  <span
                    className="text-4xl md:text-5xl font-light tracking-tight text-[#7A6A5C] block mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {s.number}
                  </span>
                  <span className="text-[9px] tracking-[2px] text-[#7A6A5C]/45 font-bold uppercase block mb-1">
                    {s.subtitle}
                  </span>
                  <div className="text-[12.5px] text-[#2D231F]/90 font-light tracking-wide transition-colors group-hover:text-[#2D231F]">
                    {s.label}
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-linear-to-b from-transparent via-[#2D231F]/15 to-transparent hidden md:block" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 border-t border-b border-[#D9CDBE] bg-[#EDE4D5] relative">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#1b0a11]/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light font-cormorant mb-6 leading-tight text-[#2D231F]">
              <span className="tct-shimmer-text italic block">
                Sẵn sàng kiến tạo tuyệt tác của riêng bạn?
              </span>
            </h1>
            <p className="text-sm text-[#7A6A5C] max-w-150 mx-auto leading-relaxed mb-10 font-light">
              Hãy để InviGo giúp bạn chuyển hóa câu chuyện tình yêu
              ngọt ngào thành một tác phẩm nghệ thuật số đầy kiêu hãnh dành tặng
              bạn bè và người thương.
            </p>
            <Link
              href="/templates"
              className="group/btn inline-flex items-center gap-3 px-12 py-4 bg-[#2D231F] text-[#F3EDE3] text-xs font-bold tracking-[0.2em] uppercase rounded-lg shadow-[0_10px_30px_rgba(45, 35, 31,0.15)] hover:shadow-[0_15px_40px_rgba(45, 35, 31,0.35)] hover:scale-102 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-[#2D231F]/80 transform -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1s_ease-in-out]" />

              <span className="relative z-10 flex items-center gap-2">
                Bắt đầu hành trình
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
                />
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-10 px-6 border-t border-[#D9CDBE] bg-[#F3EDE3]">
        <div className="max-w-4xl mx-auto text-center text-[12px] leading-relaxed text-[#7A6A5C]">
          Sticker và emoji trên editor dùng{" "}
          <a
            href="https://github.com/microsoft/fluentui-emoji"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#2D231F]"
          >
            Fluent UI Emoji
          </a>{" "}
          (MIT),{" "}
          <a
            href="https://github.com/twitter/twemoji"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#2D231F]"
          >
            Twemoji
          </a>{" "}
          (CC-BY 4.0) và họa tiết{" "}
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#2D231F]"
          >
            Lucide
          </a>{" "}
          (ISC).
        </div>
      </section>
    </div>
  );
}
