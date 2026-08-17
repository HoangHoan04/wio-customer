"use client";

import { PUBLIC_ROUTES } from "@/common/routes";
import IPhoneMockup from "@/components/common/IphoneMockup";
import { Award, Heart, MailOpen, MapPin, Music, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const SERIF = "var(--font-cormorant), 'Cormorant Garamond', serif";
const INK = "#2D231F";
const PAPER = "#F3EDE3";
const TAN = "#C4B09A";
const MUTED = "#7A6A5C";

const QR_CELLS = [
  1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
];

export default function HeroSection() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".tct-phone-center")?.classList.add("animate");
      document.querySelector(".tct-phone-left")?.classList.add("animate");
      document.querySelector(".tct-phone-right")?.classList.add("animate");
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .tct-hero-text { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .tct-hero-text-2 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
        .tct-hero-text-3 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both; }
        .tct-float { animation: floatY 5s ease-in-out infinite; }
        .tct-phone-left, .tct-phone-right, .tct-phone-center {
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tct-phone-left.animate {
          opacity: 0.95;
          transform: rotateY(22deg) rotateX(4deg) rotateZ(-7deg) translateZ(-50px) !important;
        }
        .tct-phone-right.animate {
          opacity: 0.95;
          transform: rotateY(-22deg) rotateX(4deg) rotateZ(7deg) translateZ(-50px) !important;
        }
        .tct-phone-center.animate {
          opacity: 1;
          transform: rotateY(-4deg) rotateX(2deg) translateZ(30px) !important;
        }
        @media (max-width: 639px) {
          .tct-phone-left.animate {
            opacity: 0.7;
            transform: rotateY(18deg) rotateX(3deg) rotateZ(-5deg) translateX(-20px) translateZ(-50px) scale(0.8) !important;
          }
          .tct-phone-right.animate {
            opacity: 0.7;
            transform: rotateY(-18deg) rotateX(3deg) rotateZ(5deg) translateX(20px) translateZ(-50px) scale(0.8) !important;
          }
          .tct-phone-center.animate {
            opacity: 1;
            transform: rotateY(0deg) rotateX(0deg) translateZ(20px) scale(0.88) !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, rgba(196,176,154,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(45,35,31,0.06) 0%, transparent 50%)`,
        }}
      />

      <div
        className="pointer-events-none absolute select-none"
        style={{
          right: "-80px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.04,
        }}
      >
        <Heart size={480} color={INK} fill={INK} />
      </div>
      <div
        className="tct-float pointer-events-none absolute"
        style={{
          bottom: "15%",
          left: "8%",
          opacity: 0.1,
          animationDuration: "5s",
        }}
      >
        <Sparkles size={80} color={TAN} />
      </div>
      <div
        className="tct-float pointer-events-none absolute"
        style={{
          top: "20%",
          right: "10%",
          opacity: 0.1,
          animationDuration: "6s",
          animationDelay: "1s",
        }}
      >
        <Award size={60} color={TAN} />
      </div>

      <div className="relative z-10 w-full px-4 pt-36 min-[480px]:pt-40 sm:pt-44 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:gap-12 lg:flex-row">
          <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
            <div
              className="tct-hero-text mb-5 sm:mb-7 inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] tracking-[3px] sm:tracking-[5px] uppercase"
              style={{ color: MUTED, fontFamily: SERIF }}
            >
              <Heart size={13} color={INK} fill={INK} />
              <span>Nền tảng thiệp online thế hệ mới</span>
              <Heart size={13} color={INK} fill={INK} />
            </div>

            <h1
              className="tct-hero-text-2 mb-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight"
              style={{ fontFamily: SERIF, color: INK }}
            >
              Thiệp online
              <br />
              cho ngày trọng đại
            </h1>

            <p
              className="tct-hero-text-3 mb-2 max-w-150 text-[clamp(0.95rem,2vw,1.25rem)] italic leading-relaxed"
              style={{ fontFamily: SERIF, color: MUTED }}
            >
              Gửi lời mời tinh tế, tự động hóa danh sách khách (RSVP), tích hợp
              mừng cưới không tiền mặt.
            </p>
            <p
              className="tct-hero-text-3 mb-7 sm:mb-8 max-w-150 text-[clamp(0.85rem,1.5vw,1.1rem)]"
              style={{ fontFamily: SERIF, color: `${MUTED}B3` }}
            >
              Tạo thiệp độc bản chỉ trong vài phút — cưới hỏi và mọi dịp khác.
            </p>

            <div className="tct-hero-text-3 flex w-full flex-col sm:flex-row sm:w-auto flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
              <Link
                href={PUBLIC_ROUTES.TEMPLATES}
                className="w-full sm:w-auto text-center px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg transition-all hover:-translate-y-px hover:shadow-xl"
                style={{ background: INK, color: PAPER, fontFamily: SERIF }}
              >
                Thiết kế ngay
              </Link>
              <Link
                href={PUBLIC_ROUTES.USER_MANUAL}
                className="w-full sm:w-auto text-center border-[1.5px] px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase transition-colors hover:bg-[#2D231F]/6"
                style={{
                  borderColor: INK,
                  color: INK,
                  fontFamily: SERIF,
                }}
              >
                Xem hướng dẫn
              </Link>
            </div>
          </div>

          <div className="flex min-h-[390px] sm:min-h-[440px] lg:min-h-120 w-full items-center justify-center lg:w-1/2 overflow-visible py-2 sm:py-4">
            <div
              className="relative flex items-center justify-center w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[480px] h-[390px] sm:h-[440px] lg:h-[480px]"
              style={{ perspective: "1200px" }}
            >
              <IPhoneMockup
                className="tct-phone-left"
                size="small"
                position={{ left: "50%", top: "50px", marginLeft: "-165px" }}
                transform="rotateY(22deg) rotateX(4deg) rotateZ(-7deg) translateZ(-50px)"
              >
                <div
                  className="flex h-full flex-1 flex-col px-4 pb-4 pt-8 text-[#F3EDE3]"
                  style={{
                    background:
                      "linear-gradient(170deg, #2a211c 0%, #1a1512 100%)",
                    fontFamily: SERIF,
                  }}
                >
                  <p
                    className="text-center text-[9px] tracking-[0.28em] uppercase"
                    style={{ color: TAN }}
                  >
                    Hồi đáp
                  </p>
                  <h3 className="mt-1 text-center text-[15px] leading-snug text-[#F3EDE3]">
                    Minh Anh ơi,
                    <br />
                    mình chờ bạn đó
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-[8px] tracking-[0.16em] uppercase text-[#C4B09A]/55">
                        Khách mời
                      </p>
                      <p className="mt-1 border-b border-[#C4B09A]/25 pb-1.5 text-[12px]">
                        Trần Minh Anh
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.16em] uppercase text-[#C4B09A]/55">
                        Số người
                      </p>
                      <p className="mt-1 border-b border-[#C4B09A]/25 pb-1.5 text-[12px]">
                        2 người · đi cùng mẹ
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <span
                        className="py-2 text-center text-[9px] font-semibold tracking-[0.12em] uppercase"
                        style={{ background: PAPER, color: INK }}
                      >
                        Có mặt
                      </span>
                      <span className="border border-[#C4B09A]/30 py-2 text-center text-[9px] tracking-[0.12em] uppercase text-[#C4B09A]/70">
                        Xin lỗi
                      </span>
                    </div>
                    <span
                      className="block w-full py-2 text-center text-[10px] font-semibold tracking-[0.2em] uppercase"
                      style={{ background: PAPER, color: INK }}
                    >
                      Gửi lời
                    </span>
                  </div>
                  <p className="mt-auto pt-3 text-center text-[8px] leading-relaxed text-[#C4B09A]/45">
                    Linh & An sẽ nhận ngay trên dashboard
                  </p>
                </div>
              </IPhoneMockup>

              <IPhoneMockup
                className="tct-phone-right"
                size="small"
                position={{ left: "50%", top: "50px", marginLeft: "-25px" }}
                transform="rotateY(-22deg) rotateX(4deg) rotateZ(7deg) translateZ(-50px)"
              >
                <div
                  className="flex h-full flex-1 flex-col px-4 pb-4 pt-8 text-[#F3EDE3]"
                  style={{
                    background:
                      "linear-gradient(170deg, #2a211c 0%, #1a1512 100%)",
                    fontFamily: SERIF,
                  }}
                >
                  <p
                    className="text-center text-[9px] tracking-[0.28em] uppercase"
                    style={{ color: TAN }}
                  >
                    Sổ lưu bút
                  </p>
                  <h3 className="mt-1 text-center text-[15px] text-[#F3EDE3]">
                    Lời chúc từ bạn
                  </h3>
                  <div className="mt-4 flex-1 space-y-2.5">
                    <div className="border border-[#C4B09A]/15 bg-[#1a1512]/80 p-2.5">
                      <p className="text-[10px] leading-relaxed italic text-[#EDE4D5]">
                        “Chúc hai bạn một đời bình yên, nắm tay nhau qua mọi
                        mùa.”
                      </p>
                      <p className="mt-1.5 text-right text-[8px] tracking-[0.12em] uppercase text-[#C4B09A]/70">
                        — Mai, bạn thân
                      </p>
                    </div>
                    <div className="flex items-start gap-2 border border-[#C4B09A]/15 p-2">
                      <MapPin
                        size={12}
                        className="mt-0.5 shrink-0"
                        color={TAN}
                      />
                      <div>
                        <p className="text-[10px] font-semibold text-[#F3EDE3]">
                          The Grand Hall
                        </p>
                        <p className="text-[8px] text-[#C4B09A]/70">
                          1002 Tạ Quang Bửu, Q.8
                        </p>
                      </div>
                    </div>
                    <div className="mx-auto grid w-18 grid-cols-5 gap-px bg-[#F3EDE3] p-1.5">
                      {QR_CELLS.map((on, i) => (
                        <span
                          key={i}
                          className="aspect-square"
                          style={{ background: on ? INK : PAPER }}
                        />
                      ))}
                    </div>
                    <p className="text-center text-[8px] tracking-[0.14em] uppercase text-[#C4B09A]/55">
                      Mừng cưới · MB Bank
                    </p>
                  </div>
                </div>
              </IPhoneMockup>

              <IPhoneMockup
                className="tct-phone-center"
                size="medium"
                position={{ left: "50%", top: "20px", marginLeft: "-110px" }}
                transform="rotateY(-4deg) rotateX(2deg) translateZ(30px)"
              >
                <div
                  className="relative flex h-full flex-1 flex-col text-[#F3EDE3]"
                  style={{
                    background:
                      "linear-gradient(180deg, #2a211c 0%, #3a2e28 50%, #1a1512 100%)",
                    fontFamily: SERIF,
                  }}
                >
                  <div className="relative h-[42%] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 20%, #C4B09A 0%, transparent 42%), linear-gradient(165deg, #EDE4D5 0%, #C4B09A 48%, #2D231F 100%)",
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#2a211c] via-transparent to-black/20" />
                  </div>
                  <div className="z-10 flex flex-1 flex-col px-4 pb-5 pt-3 text-center">
                    <p
                      className="text-[8px] font-medium tracking-[0.32em] uppercase"
                      style={{ color: TAN }}
                    >
                      Trân trọng kính mời
                    </p>
                    <h2 className="mt-1.5 text-[22px] font-light leading-none tracking-wide">
                      Linh
                    </h2>
                    <p className="my-0.5 text-[13px]" style={{ color: TAN }}>
                      &
                    </p>
                    <h2 className="text-[22px] font-light leading-none tracking-wide">
                      An
                    </h2>
                    <div className="my-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-[#C4B09A]/25" />
                      <span className="text-[8px]" style={{ color: TAN }}>
                        ♡
                      </span>
                      <span className="h-px flex-1 bg-[#C4B09A]/25" />
                    </div>
                    <p className="text-[10px] tracking-[0.14em] uppercase">
                      Chủ nhật · 20.12.2026
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#C4B09A]/75">
                      The Grand Hall · Sài Gòn
                    </p>
                    <button
                      disabled
                      className="mt-auto flex w-full items-center justify-center gap-1.5 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
                      style={{ background: PAPER, color: INK }}
                    >
                      <MailOpen size={11} />
                      Mở thiệp
                    </button>
                    <p className="mt-2 flex items-center justify-center gap-2 text-[8px] text-[#C4B09A]/55">
                      <Music size={9} /> Nhạc nền · Album ảnh
                    </p>
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
