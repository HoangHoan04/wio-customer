"use client";

import IPhoneMockup from "@/components/common/IphoneMockup";
import { ArrowRight, Award, Heart, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const C = {
  bg: "#0f0608",
  bgCard: "#1a0a0f",
  gold: "#d4af37",
  goldLight: "#f5c842",
  cream: "#f5e6d3",
  muted: "#c9a98a",
};

const STATS = [
  { number: "2.400", label: "Cặp đôi hạnh phúc" },
  { number: "14", label: "Mẫu thiệp cưới" },
  { number: "4.9★", label: "Đánh giá trung bình" },
];

const SERVICES = [
  {
    icon: Heart,
    title: "Tư Vấn Phong Cách",
    desc: "Chuyên gia tư vấn 1:1, giúp bạn chọn bộ trang phục hoàn hảo nhất",
  },
  {
    icon: Sparkles,
    title: "Chụp Ảnh Cưới",
    desc: "Gói chụp ảnh trong tiệm & ngoại cảnh với ekip chuyên nghiệp",
  },
  {
    icon: Heart,
    title: "May Đo Riêng",
    desc: "Thiết kế và may đo theo yêu cầu, giao hàng trong 14-21 ngày",
  },
  {
    icon: Heart,
    title: "Giao Hàng Toàn Quốc",
    desc: "Đóng gói chuyên dụng, giao hàng an toàn đến tận tay bạn",
  },
];

const TESTIMONIALS = [
  {
    name: "Nguyễn Thị Hương",
    role: "Cô dâu tháng 12/2024",
    text: "Váy cưới đẹp hơn tôi tưởng tượng rất nhiều. Nhân viên tận tâm, nhiệt tình từ lúc tư vấn đến ngày lấy đồ.",
    stars: 5,
    avatar: "H",
  },
  {
    name: "Trần Minh Khoa",
    role: "Chú rể tháng 11/2024",
    text: "Bộ vest may đo vừa vặn hoàn hảo. Chất liệu cao cấp, đường may sắc sảo.",
    stars: 5,
    avatar: "K",
  },
  {
    name: "Lê Thị Mai",
    role: "Cô dâu tháng 10/2024",
    text: "Mình thuê áo dài truyền thống cho cả hai bên gia đình. Tất cả đều rất hài lòng.",
    stars: 5,
    avatar: "M",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Chọn Mẫu Thiệp",
    desc: "Lựa chọn từ 14 mẫu thiệp cưới đẹp mắt, hiện đại và sang trọng",
  },
  {
    step: 2,
    title: "Tùy Chỉnh Nội Dung",
    desc: "Điền thông tin cá nhân, chỉnh sửa màu sắc, font chữ và bố cục",
  },
  {
    step: 3,
    title: "Xem Trước & Chỉnh Sửa",
    desc: "Xem lại thiệp cưới hoàn chỉnh và điều chỉnh chi tiết cuối cùng",
  },
  {
    step: 4,
    title: "Chia Sẻ & Gửi Thiệp",
    desc: "Gửi thiệp trực tiếp đến khách mời qua email, Zalo hoặc mạng xã hội",
  },
];

const FEATURES = [
  {
    icon: Heart,
    title: "Thiết kế tinh tế",
    desc: "Các mẫu thiệp cưới được thiết kế bởi đội ngũ chuyên nghiệp.",
  },
  {
    icon: Sparkles,
    title: "Cá nhân hóa hoàn toàn",
    desc: "Tùy chỉnh mọi chi tiết từ màu sắc, font chữ, hình ảnh.",
  },
  {
    icon: Users,
    title: "Quản lý khách mời",
    desc: "Theo dõi danh sách khách mời, xác nhận tham dự dễ dàng.",
  },
  {
    icon: Award,
    title: "Uy tín & Chuyên nghiệp",
    desc: "Đã phục vụ hơn 10,000 cặp đôi với tỷ lệ hài lòng 99%.",
  },
];

function ScrollReveal({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`tct-scroll-reveal ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".tct-phone-center")?.classList.add("animate");
      document.querySelector(".tct-phone-left")?.classList.add("animate");
      document.querySelector(".tct-phone-right")?.classList.add("animate");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.cream, overflowX: "hidden" }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .tct-hero-text { animation: fadeUp 0.7s ease 0.2s forwards; }
        .tct-hero-text-2 { animation: fadeUp 0.7s ease 0.4s forwards; }
        .tct-hero-text-3 { animation: fadeUp 0.7s ease 0.8s forwards; }
        .tct-shimmer-text { background: linear-gradient(90deg, ${C.gold} 0%, ${C.goldLight} 40%, #fff8d6 50%, ${C.goldLight} 60%, ${C.gold} 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
        .tct-scroll-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .tct-scroll-reveal.visible { opacity: 1; transform: translateY(0); }
        .tct-float { animation: floatY 4s ease-in-out infinite; }
        .tct-card { transition: transform 0.35s ease, box-shadow 0.35s ease; cursor: pointer; }
        .tct-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.4) !important; }

        /* Phone mockups */
        .tct-phone-left, .tct-phone-right, .tct-phone-center {
          opacity: 0;
        }
        .tct-phone-left.animate {
          opacity: 1;
          transform: rotateY(25deg) rotateX(5deg) rotateZ(-8deg) translateZ(-60px) !important;
        }
        .tct-phone-right.animate {
          opacity: 1;
          transform: rotateY(-25deg) rotateX(5deg) rotateZ(8deg) translateZ(-60px) !important;
        }
        .tct-phone-center.animate {
          opacity: 1;
          transform: rotateY(-5deg) rotateX(3deg) translateZ(40px) !important;
        }
        .tct-phone-center.animate .tct-screen-in,
        .tct-phone-left.animate .tct-screen-in,
        .tct-phone-right.animate .tct-screen-in {
          opacity: 1;
          transition: opacity 0.5s ease 0.4s;
        }
      `}</style>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, rgba(212,175,55,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(180,20,50,0.12) 0%, transparent 50%)`,
          }}
        />

        {/* Icon nền mờ bên phải */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            right: "-80px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.025,
          }}
        >
          <Heart size={480} color={C.gold} fill={C.gold} />
        </div>

        {/* Icon float trang trí */}
        <div
          className="tct-float absolute"
          style={{
            bottom: "15%",
            left: "8%",
            opacity: 0.08,
            animationDuration: "5s",
          }}
        >
          <Sparkles size={80} color={C.gold} />
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
          <Award size={60} color={C.gold} />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:text-left">
              <div
                className="tct-hero-text inline-flex items-center gap-3 mb-7 text-[11px] tracking-[5px] uppercase text-[#d4af37]"
                style={{ opacity: 0 }}
              >
                <Heart size={16} className="text-[#d4af37]" fill="#d4af37" />
                <span>Tiệm Cưới Cao Cấp Tại TP.HCM</span>
                <Heart size={16} className="text-[#d4af37]" fill="#d4af37" />
              </div>
              <h1
                className="tct-hero-text-2 text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-tight mb-4"
                style={{ opacity: 0 }}
              >
                <span className="tct-shimmer-text">Tiệm Cưới Tân Thời</span>
              </h1>
              <p
                className="tct-hero-text-3 text-[clamp(1rem,1.5vw,1.25rem)] italic text-[#c9a98a] max-w-[600px]"
                style={{ opacity: 0 }}
              >
                Nơi mỗi khoảnh khắc trở thành kỷ niệm vĩnh cửu
              </p>
              <p
                className="tct-hero-text-3 text-[clamp(1rem,1.5vw,1.25rem)] italic text-[#c9a98a] max-w-[600px] mb-6"
                style={{ opacity: 0 }}
              >
                Trang phục cưới tinh tế, xứng với ngày trọng đại nhất đời bạn
              </p>
              <div
                className="tct-hero-text-3 flex gap-4 justify-center lg:justify-start flex-wrap mt-6"
                style={{ opacity: 0 }}
              >
                <Link
                  href="/templates"
                  className="px-9 py-4 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] text-sm font-bold tracking-widest uppercase rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Khám Phá Ngay
                </Link>
                <Link
                  href="/user-manual"
                  className="px-9 py-4 bg-transparent border-[1.5px] border-[#d4af37] text-[#d4af37] text-sm font-semibold tracking-widest uppercase rounded-md hover:bg-[rgba(212,175,55,0.1)] transition-all"
                >
                  Hướng dẫn
                </Link>
              </div>
            </div>

            {/* 3 điện thoại */}
            <div className="w-full lg:w-1/2 flex items-center justify-center min-h-[600px]">
              <div
                className="relative"
                style={{
                  width: "600px",
                  height: "540px",
                  perspective: "1200px",
                }}
              >
                <IPhoneMockup
                  className="tct-phone-left"
                  size="small"
                  position={{ left: "100px", top: "100px" }}
                  transform="rotateY(25deg) rotateX(5deg) rotateZ(-8deg) translateZ(-60px)"
                >
                  <div
                    className="flex-1 relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(170deg, #2a1015 0%, #4a1a20 40%, #3a1018 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.08) 0%, transparent 60%), linear-gradient(180deg, transparent 30%, rgba(15,6,8,0.85) 100%)",
                      }}
                    />
                  </div>
                </IPhoneMockup>

                <IPhoneMockup
                  className="tct-phone-right"
                  size="small"
                  position={{ right: "10px", top: "100px" }}
                  transform="rotateY(-25deg) rotateX(5deg) rotateZ(8deg) translateZ(-60px)"
                >
                  <div
                    className="flex-1 relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(170deg, #2a1015 0%, #4a1a20 40%, #3a1018 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.08) 0%, transparent 60%), linear-gradient(180deg, transparent 30%, rgba(15,6,8,0.85) 100%)",
                      }}
                    />
                  </div>
                </IPhoneMockup>

                <IPhoneMockup
                  className="tct-phone-center"
                  size="medium"
                  position={{ left: "50%", top: "50px", marginLeft: "-80px" }}
                  transform="rotateY(-5deg) rotateX(3deg) translateZ(40px)"
                >
                  <div
                    className="flex-1 relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(170deg, #2a1015 0%, #4a1a20 40%, #3a1018 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.08) 0%, transparent 60%), linear-gradient(180deg, transparent 30%, rgba(15,6,8,0.85) 100%)",
                      }}
                    />
                  </div>
                </IPhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div
        className="border-y border-[#d4af37]/20 py-8 px-6"
        style={{
          background: `linear-gradient(90deg, ${C.bgCard}, #221019, ${C.bgCard})`,
        }}
      >
        <ScrollReveal>
          <div className="max-w-[1100px] mx-auto grid grid-cols-3 gap-0">
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`text-center p-4 ${i < STATS.length - 1 ? "border-r border-[#d4af37]/15" : ""}`}
              >
                <div className="tct-shimmer-text text-[clamp(1.6rem,4vw,2.4rem)] font-bold block mb-1">
                  {s.number}
                </div>
                <div className="text-xs text-[#c9a98a] tracking-wider uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* About / Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="tct-shimmer-text italic">
                  Hạnh phúc của bạn, sứ mệnh của chúng tôi
                </span>
              </h2>
              <p className="text-sm tracking-[5px] uppercase text-[#d4af37] mt-4">
                Sứ Mệnh Của Chúng Tôi
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={i}>
                <div className="p-6 rounded-xl bg-[#221019] border border-[rgba(212,175,55,0.2)] hover:border-[#d4af37] transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(212,175,55,0.15)] text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#1a0a0f] transition-all duration-300">
                      <f.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#f5c842] mb-2">
                        {f.title}
                      </h3>
                      <p className="text-[#c9a98a] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <div
        className="border-y border-[#d4af37]/20 py-20 px-6 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #1a0812 0%, #2d1020 40%, #1a0812 100%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)",
          }}
        />
        <ScrollReveal>
          <div className="relative max-w-[700px] mx-auto">
            <p className="italic text-[clamp(1.4rem,3vw,2.2rem)] text-[#f5e6d3] leading-relaxed mb-6">
              ❝ Một tấm thiệp cưới đẹp không chỉ là lời mời, mà còn là dấu ấn
              đầu tiên khắc sâu trong ký ức của tất cả những ai được chứng kiến
              ngày trọng đại ấy. ❞
            </p>
            <p className="text-xs tracking-[3px] text-[#d4af37] uppercase">
              — Tiệm Cưới Tân Thời —
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Services */}
      <section className="py-20 px-6 max-w-[1100px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1rem,4vw,2.5rem)] font-bold">
              <span className="tct-shimmer-text italic">
                Dịch vụ của chúng tôi
              </span>
            </h2>
            <p className="text-xs tracking-[5px] uppercase text-[#d4af37] mt-4">
              Cùng xem các dịch vụ của chúng tôi
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={i}>
              <div
                className="tct-card p-8 rounded-xl text-center border border-[rgba(212,175,55,0.18)]"
                style={{ background: C.bgCard }}
              >
                <div className="flex justify-center mb-5">
                  <div
                    className="w-12 h-12 text-[#d4af37]"
                    style={{
                      filter: "drop-shadow(0 4px 12px rgba(212,175,55,0.25))",
                    }}
                  >
                    <s.icon size={48} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#f5c842] mb-3 tracking-wide">
                  {s.title}
                </h3>
                <p className="text-sm text-[#c9a98a] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-20 px-6"
        style={{
          background: `linear-gradient(180deg, ${C.bg} 0%, #150810 50%, ${C.bg} 100%)`,
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[5px] uppercase text-[#d4af37] mb-4">
                Đánh Giá Khách Hàng
              </p>
              <h2 className="text-[clamp(1rem,4vw,2.5rem)] font-bold">
                <span className="tct-shimmer-text italic">
                  Khách hàng nói gì về chúng tôi
                </span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={i}>
                <div
                  className="p-8 rounded-xl border border-[rgba(212,175,55,0.18)] h-full flex flex-col justify-between"
                  style={{ background: C.bgCard }}
                >
                  <div>
                    <div className="text-[#f5c842] mb-4 text-sm">
                      {Array(t.stars).fill("★").join("")}
                    </div>
                    <p className="text-sm text-[#c9a98a] leading-relaxed italic mb-6">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="w-[46px] h-[46px] rounded-full bg-linear-to-br from-[#d4af37] to-[#f5c842] flex items-center justify-center font-bold text-lg text-[#0f0608] shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#f5e6d3]">
                        {t.name}
                      </div>
                      <div className="text-xs text-[#8a6d5a] tracking-wide">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[5px] uppercase text-[#d4af37] mb-4">
              Quy Trình Đơn Giản
            </p>
            <h2 className="text-[clamp(1rem,4vw,2.5rem)] font-bold mb-4">
              <span className="tct-shimmer-text italic">
                Tạo thiệp cưới chỉ trong 5 phút
              </span>
            </h2>
            <p className="text-sm text-[#c9a98a] max-w-[600px] mx-auto leading-relaxed">
              Dễ dàng tạo thiệp cưới đẹp mắt và chuyên nghiệp với 4 bước đơn
              giản
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1100px] mx-auto">
          {STEPS.map((item, i) => (
            <ScrollReveal key={item.step}>
              <div
                className="tct-card p-8 rounded-2xl text-center border-[1.5px] border-[rgba(212,175,55,0.25)] relative z-1"
                style={{ background: C.bgCard }}
              >
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#d4af37] to-[#f5c842] flex items-center justify-center mx-auto mb-5 text-3xl font-bold text-[#0f0608] relative shadow-lg">
                  {item.step}
                  <div className="absolute inset-[-4px] rounded-full border-2 border-[#d4af37] opacity-30" />
                </div>
                <h3 className="text-lg font-bold text-[#f5c842] mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm text-[#c9a98a] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="text-center mt-16">
            <Link
              href="/templates"
              className="inline-flex items-center gap-3 px-12 py-4.5 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] text-sm font-bold tracking-widest uppercase rounded-lg shadow-2xl hover:shadow-[0_8px_32px_rgba(212,175,55,0.5)] hover:scale-105 transition-all"
            >
              Bắt Đầu Tạo Thiệp Ngay <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <div className="flex items-center justify-center gap-4 px-6 pb-10 text-lg text-[#d4af37] tracking-widest">
        ❧ ✦ ❧
      </div>
    </div>
  );
}
