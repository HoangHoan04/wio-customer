"use client";

import { Award, Heart, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: Heart,
    title: "Thiết kế tinh tế",
    desc: "Các mẫu thiệp cưới được thiết kế bởi đội ngũ chuyên nghiệp, kết hợp giữa phong cách hiện đại và truyền thống.",
  },
  {
    icon: Sparkles,
    title: "Cá nhân hóa hoàn toàn",
    desc: "Tùy chỉnh mọi chi tiết từ màu sắc, font chữ, hình ảnh đến nội dung để phù hợp với phong cách đám cưới của bạn.",
  },
  {
    icon: Users,
    title: "Quản lý khách mời",
    desc: "Theo dõi danh sách khách mời, xác nhận tham dự, và quản lý lời chúc một cách dễ dàng trên nền tảng.",
  },
  {
    icon: Award,
    title: "Uy tín & Chuyên nghiệp",
    desc: "Đã phục vụ hơn 10,000 cặp đôi với tỷ lệ hài lòng 99%. Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giúp đỡ.",
  },
];

const stats = [
  { number: "10,000+", label: "Cặp đôi tin dùng" },
  { number: "50+", label: "Mẫu thiệp đa dạng" },
  { number: "99%", label: "Khách hàng hài lòng" },
  { number: "24/7", label: "Hỗ trợ nhanh chóng" },
];

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("animate-fadeIn");
        });
      },
      { threshold: 0.1 },
    );
    sectionRef.current
      ?.querySelectorAll(".fade-item")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a0a0f] text-[#f5e6d3]">
      <style>{`
        @keyframes shimmer { 0% { background-position: 100% center; } 100% { background-position: -100% center; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>

      <section className="relative overflow-hidden pt-[140px] px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-[#d4af37] via-[#f5c842] to-[#d4af37] bg-clip-text text-transparent"
            style={{
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Về Chúng Tôi
          </h1>
          <p className="text-lg md:text-xl text-[#c9a98a] leading-relaxed">
            Chúng tôi tạo ra những thiệp cưới trực tuyến độc đáo, giúp bạn chia
            sẻ niềm hạnh phúc của mình với bạn bè và người thân một cách hiện
            đại và tiện lợi nhất.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-4">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-[#c9a98a] max-w-2xl mx-auto">
              Mang đến trải nghiệm thiệp cưới trực tuyến tuyệt vời nhất, kết nối
              yêu thương và hạnh phúc trong ngày trọng đại của bạn.
            </p>
          </div>
          <div ref={sectionRef} className="grid md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="fade-item opacity-0 group p-6 rounded-xl bg-[#221019] border border-[rgba(212,175,55,0.2)] hover:border-[#d4af37] transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[rgba(212,175,55,0.15)] text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#1a0a0f] transition-all duration-300">
                    <f.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#f5c842] mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[#c9a98a] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.15)] hover:border-[#d4af37] transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
                  {s.number}
                </div>
                <div className="text-sm text-[#c9a98a]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#1a0a0f]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-6">
            Sẵn sàng tạo thiệp cưới của bạn?
          </h2>
          <p className="text-[#c9a98a] mb-8 text-lg">
            Hãy để chúng tôi giúp bạn tạo ra một thiệp cưới độc đáo và ý nghĩa
            cho ngày trọng đại của bạn.
          </p>
          <Link
            href="/templates"
            className="inline-block px-8 py-4 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[rgba(212,175,55,0.3)]"
          >
            Bắt Đầu Ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
