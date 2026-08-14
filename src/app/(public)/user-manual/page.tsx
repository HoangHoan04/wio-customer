"use client";

import { PUBLIC_ROUTES } from "@/common/routes";
import ScrollReveal from "@/components/home/ScrollReveal";
import {
  ArrowRight,
  Link2,
  Music,
  Palette,
  Play,
  Smartphone,
  Users,
} from "lucide-react";
import Link from "next/link";

const TUTORIAL_YOUTUBE_ID =
  process.env.NEXT_PUBLIC_TUTORIAL_YOUTUBE_ID?.trim() || "";

const HIGHLIGHTS = [
  "Có gói miễn phí",
  "RSVP trên thiệp",
  "Nhạc nền & YouTube",
  "Xem trước trên điện thoại",
];

const STEPS = [
  {
    step: "01",
    title: "Chọn loại thiệp và mẫu",
    subtitle: "CƯỚI · SINH NHẬT · SỰ KIỆN",
    desc: "Chọn loại thiệp phù hợp — cưới hỏi, sinh nhật, tốt nghiệp, thôi nôi, tân gia hoặc sự kiện riêng — rồi lấy một mẫu làm điểm bắt đầu.",
  },
  {
    step: "02",
    title: "Đăng nhập và điền nội dung",
    subtitle: "CHỮ · ẢNH · NHẠC",
    desc: "Cần tài khoản để lưu thiệp. Sửa lời mời, ảnh, nhạc nền, ngày giờ và địa điểm. Thiệp hiện đúng câu chuyện của bạn, không phải nội dung mẫu.",
  },
  {
    step: "03",
    title: "Xem trước trên điện thoại",
    subtitle: "XEM NHƯ KHÁCH MỜI",
    desc: "Mở thử hiệu ứng bao thư, nhạc nền và từng trang thiệp như khách sẽ thấy. Chỉnh tiếp nếu chưa ưng, rồi mới gửi.",
  },
  {
    step: "04",
    title: "Xuất bản và gửi link",
    subtitle: "CHIA SẺ · RSVP",
    desc: "Sao chép đường dẫn gửi Zalo, Messenger hoặc mạng xã hội. Khách xác nhận tham dự ngay trên thiệp; bạn theo dõi danh sách trên hệ thống.",
  },
];

const TIPS = [
  {
    icon: Users,
    title: "RSVP trên thiệp",
    subtitle: "BIẾT AI ĐẾN, AI VẮNG",
    desc: "Khách xác nhận tham dự, số người đi cùng và gửi lời chúc ngay trên link. Bạn theo dõi danh sách, xếp bàn nếu cần.",
  },
  {
    icon: Music,
    title: "Nhạc nền khi mở thiệp",
    subtitle: "TỰ PHÁT THEO KHÔNG KHÍ",
    desc: "Chọn bài có sẵn, tải tệp âm thanh, hoặc gắn YouTube. Nhạc tự phát khi khách mở thiệp.",
  },
  {
    icon: Link2,
    title: "Sửa sau khi đã gửi",
    subtitle: "LINK TỰ CẬP NHẬT",
    desc: "Đổi ngày giờ, địa điểm hay ảnh trên trang quản lý. Link đã gửi tự cập nhật, không cần tạo thiệp mới.",
  },
];

function TutorialMedia() {
  if (TUTORIAL_YOUTUBE_ID) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#2D231F]/15 shadow-[0_20px_50px_rgba(45,35,31,0.12)] aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${TUTORIAL_YOUTUBE_ID}?rel=0&modestbranding=1`}
          title="Hướng dẫn tạo thiệp online InviGo"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#2D231F]/12 px-8 text-center"
      style={{
        background: "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,35,31,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#2D231F]/25 bg-[#F3EDE3] text-[#2D231F] shadow-[0_8px_24px_rgba(45,35,31,0.08)]">
        <Play size={22} fill="currentColor" className="ml-0.5" />
      </div>
      <p
        className="relative z-10 mt-6 text-lg font-light text-[#2D231F]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Video hướng dẫn đang được chuẩn bị
      </p>
      <p className="relative z-10 mt-2 max-w-sm text-[13px] leading-relaxed text-[#7A6A5C]/80 font-light">
        Trong lúc chờ, làm theo bốn bước bên dưới — đủ để tạo và gửi thiệp.
      </p>
    </div>
  );
}

export default function UserManualPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F3EDE3] pt-35 pb-24 text-[#2D231F]">
      <style>{`
        .tct-scroll-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tct-scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="pointer-events-none absolute top-[8%] left-1/4 h-150 w-150 bg-[radial-gradient(circle,rgba(45,35,31,0.03)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute right-1/4 bottom-[20%] h-125 w-125 bg-[radial-gradient(circle,rgba(45,35,31,0.02)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-300 px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <p className="mb-4 font-cormorant text-xs font-semibold uppercase tracking-[6px] text-[#7A6A5C]">
              Hướng dẫn sử dụng
            </p>
            <h1 className="font-cormorant text-[clamp(2rem,5vw,3.2rem)] font-light leading-tight">
              <span className="tct-shimmer-text italic block">
                Từ mẫu có sẵn đến thiệp đã gửi
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-140 font-cormorant text-xs uppercase tracking-widest leading-relaxed text-[#7A6A5C]/70">
              Chọn mẫu, điền nội dung, xem trước rồi gửi link cho khách mời
            </p>
            <div className="mx-auto mt-6 h-px w-12 bg-[#2D231F]/40" />
          </div>
        </ScrollReveal>

        <div className="mb-28 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal className="lg:col-span-7">
            <TutorialMedia />
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px] text-[#7A6A5C]/50">
              InviGo
            </p>
            <h2
              className="mb-4 text-2xl font-light text-[#2D231F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Làm thiệp online trong vài bước
            </h2>
            <p className="mb-6 text-[14px] font-light leading-relaxed text-[#7A6A5C]/85">
              InviGo giúp bạn tạo thiệp mời cho cưới hỏi, sinh nhật, tốt nghiệp
              và sự kiện riêng. Khách mở thiệp trên điện thoại, xác nhận tham dự
              ngay trên link — không cần tải app.
            </p>

            <div className="mb-8 flex flex-wrap gap-2">
              {HIGHLIGHTS.map((text) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2D231F]/15 bg-[#EDE4D5]/80 px-3.5 py-1.5 text-[12px] text-[#2D231F]"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F3EDE3] text-[9px] text-[#7A6A5C]">
                    ✓
                  </span>
                  {text}
                </span>
              ))}
            </div>

            <Link
              href={PUBLIC_ROUTES.TEMPLATES}
              className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-lg bg-[#2D231F] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F3EDE3] shadow-[0_10px_30px_rgba(45,35,31,0.15)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(45,35,31,0.28)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Bắt đầu tạo thiệp
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
                />
              </span>
            </Link>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mb-14 text-center">
            <p className="mb-4 font-cormorant text-xs font-semibold uppercase tracking-[6px] text-[#7A6A5C]">
              Bốn bước
            </p>
            <h2 className="font-cormorant text-[clamp(1.6rem,3.5vw,2.4rem)] font-light">
              <span className="tct-shimmer-text italic block">
                Làm thiệp như thế nào
              </span>
            </h2>
            <div className="mx-auto mt-6 h-px w-12 bg-[#2D231F]/40" />
          </div>
        </ScrollReveal>

        <div className="mb-28 grid grid-cols-1 gap-6 md:grid-cols-2">
          {STEPS.map((item) => (
            <ScrollReveal key={item.step}>
              <div
                className="group relative flex h-full gap-5 overflow-hidden rounded-2xl border p-7 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
                  borderColor: "rgba(45, 35, 31, 0.12)",
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(45,35,31,0.05)_0%,transparent_55%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
                <div
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#2D231F]/25 bg-[#F3EDE3] text-lg font-light text-[#7A6A5C]"
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', serif",
                  }}
                >
                  {item.step}
                </div>
                <div className="relative z-10">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-[3px] text-[#7A6A5C]/40">
                    {item.subtitle}
                  </span>
                  <h3
                    className="mb-2 text-lg font-medium text-[#2D231F]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[13px] font-light leading-relaxed text-[#7A6A5C]/80">
                    {item.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mb-14 text-center">
            <p className="mb-4 font-cormorant text-xs font-semibold uppercase tracking-[6px] text-[#7A6A5C]">
              Khi thiệp đã sẵn sàng
            </p>
            <h2 className="font-cormorant text-[clamp(1.6rem,3.5vw,2.4rem)] font-light">
              <span className="tct-shimmer-text italic block">
                Những việc nên biết
              </span>
            </h2>
            <div className="mx-auto mt-6 h-px w-12 bg-[#2D231F]/40" />
          </div>
        </ScrollReveal>

        <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <ScrollReveal key={tip.title}>
                <div
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
                    borderColor: "rgba(45, 35, 31, 0.12)",
                  }}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#2D231F]/20 bg-[#EDE4D5] text-[#2D231F] transition-all duration-500 group-hover:bg-[#2D231F] group-hover:text-[#F3EDE3]">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-[3px] text-[#7A6A5C]/50">
                    {tip.subtitle}
                  </span>
                  <h3
                    className="mb-3 text-lg font-medium text-[#2D231F]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {tip.title}
                  </h3>
                  <p className="mt-auto text-[13px] font-light leading-relaxed text-[#7A6A5C]/75">
                    {tip.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div
            className="relative overflow-hidden rounded-2xl border px-8 py-14 text-center"
            style={{
              background: "linear-gradient(180deg, #EDE4D5 0%, #F3EDE3 100%)",
              borderColor: "rgba(45, 35, 31, 0.12)",
            }}
          >
            <Palette
              className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-[#2D231F]/4"
              strokeWidth={1}
            />
            <Smartphone
              className="pointer-events-none absolute -bottom-6 -left-4 h-24 w-24 text-[#2D231F]/4"
              strokeWidth={1}
            />
            <p className="mb-3 font-cormorant text-xs font-semibold uppercase tracking-[6px] text-[#7A6A5C]">
              Sẵn sàng gửi thiệp
            </p>
            <h2
              className="mb-4 text-[clamp(1.5rem,3vw,2.1rem)] font-light text-[#2D231F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Chọn mẫu và bắt đầu ngay
            </h2>
            <p className="mx-auto mb-8 max-w-125 text-[13px] font-light leading-relaxed text-[#7A6A5C]/80">
              Khách mời không cần đăng nhập. Bạn đăng nhập để lưu thiệp, theo
              dõi RSVP và chỉnh nội dung sau khi đã gửi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={PUBLIC_ROUTES.TEMPLATES}
                className="group/btn inline-flex items-center gap-2 rounded-lg bg-[#2D231F] px-10 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F3EDE3] shadow-[0_10px_30px_rgba(45,35,31,0.15)] transition-all duration-300 hover:scale-[1.02]"
              >
                Xem mẫu thiệp
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
                />
              </Link>
              <Link
                href={PUBLIC_ROUTES.CONTACT}
                className="rounded-lg border-[1.5px] border-[#2D231F] px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#2D231F] transition-colors hover:bg-[#2D231F]/6"
              >
                Cần hỗ trợ
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
