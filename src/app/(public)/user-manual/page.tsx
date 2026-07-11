"use client";

import Link from "next/link";

export default function UserManualPage() {
  const youtubeVideoId = "dQw4w9WgXcQ";
  const features = ["Miễn phí", "Không cần đăng ký", "10 phút", "15+ mẫu thiệp"];

  return (
    <div className="min-h-screen pt-[140px] px-6 pb-20 bg-[#0b0507] text-[#f9f6f0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Montserrat:wght@300;400;600&display=swap');
      `}</style>

      <div className="text-center max-w-[800px] mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-5 uppercase tracking-wider leading-relaxed" style={{
          fontFamily: "'Cormorant Garamond', serif",
          background: "linear-gradient(135deg, #e5c483 0%, #c5a059 50%, #e5c483 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Hướng Dẫn Tạo Thiệp Cưới Trực Tuyến
        </h1>
        <div className="w-24 h-px mx-auto bg-linear-to-r from-transparent via-[#f5c842] to-transparent" />
      </div>

      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 w-full">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl border border-[rgba(197,160,89,0.15)] shadow-2xl transition-all duration-300 hover:border-[#c5a059]">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
                title="Hướng dẫn tạo thiệp cưới trực tuyến"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#e5c483" }}>Tiệm Cưới Tân Thời</h2>
            <div className="text-base leading-relaxed font-light space-y-4" style={{ color: "#a38a75", fontFamily: "'Cormorant Garamond', serif" }}>
              <p>
                Chào mừng bạn đến với không gian sáng tạo của
                <span className="font-semibold text-[#f5c842]"> Tiệm Cưới Tân Thời</span>. Hệ thống khởi tạo thiệp cưới thông minh giúp bạn tự tay thiết kế những mẫu thiệp điện tử độc bản.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 my-6">
              {features.map((text, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light tracking-wide transition-all duration-300"
                  style={{ background: "rgba(40,10,20,0.3)", border: "1px solid rgba(233,30,99,0.3)", color: "#f9f6f0" }}>
                  <span className="flex items-center justify-center w-[18px] h-[18px] bg-white rounded-full">
                    <span className="text-[10px]" style={{ color: "rgba(40,10,20,0.9)" }}>✓</span>
                  </span>
                  {text}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/templates"
                className="inline-block px-6 py-3 rounded-md text-xs font-medium tracking-widest uppercase transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #e5c483, #c5a059)", color: "#0b0507", boxShadow: "0 4px 15px rgba(245,200,66,0.2)" }}>
                Bắt đầu tạo thiệp ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
