"use client";

import Carousel from "@/components/ui/carousel/Carousel";
import CarouselItem from "@/components/ui/carousel/CarouselItem";
import { templateService, type ITemplate } from "@/services/template.service";
import { Crown, Eye, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const VIRTUAL_MOBILE_WIDTH = 375;
const SCROLL_SPEED = 4;

function TemplateCard({ template }: { template: ITemplate }) {
  const cardBg = "#140a0d";
  const titleColor = "#f5e6d3";
  const descColor = "#c9a98a";
  const divider = "rgba(212,175,55,0.15)";

  const [isHovered, setIsHovered] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [scale, setScale] = useState(0.85);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.clientWidth;
      setScale(cardWidth / VIRTUAL_MOBILE_WIDTH);
    }
  }, []);

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current !== null) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isHovered && iframeLoaded) {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;

      scrollIntervalRef.current = window.setInterval(() => {
        try {
          const win = iframe.contentWindow!;
          const maxScroll = win.document.body.scrollHeight - win.innerHeight;
          if (win.scrollY >= maxScroll) {
            win.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          } else {
            win.scrollBy(0, SCROLL_SPEED);
          }
        } catch {}
      }, 16);
    } else {
      stopAutoScroll();
      try {
        const win = iframeRef.current?.contentWindow;
        if (win) {
          win.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }
      } catch {}
    }
    return stopAutoScroll;
  }, [isHovered, iframeLoaded]);

  return (
    <div
      className="group/card flex h-full w-full flex-col overflow-hidden rounded-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: cardBg,
        border: `1px solid  rgba(212,175,55,0.22)`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div
        ref={containerRef}
        className="relative shrink-0 overflow-hidden bg-[#0d0407] w-full"
        style={{ height: "320px" }}
      >
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-in-out ${
            isHovered
              ? "opacity-0 scale-105 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        />

        <div
          className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
            isHovered
              ? "opacity-100 scale-100 pointer-events-none"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {isHovered && (
            <iframe
              ref={iframeRef}
              src={`/preview/${template.slug}?hover=true`}
              title={`Preview ${template.name}`}
              onLoad={() => setIframeLoaded(true)}
              className="absolute pointer-events-none block border-none"
              style={{
                width: `${VIRTUAL_MOBILE_WIDTH}px`,
                height: `${Math.round(320 / scale) + 10}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            />
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(to bottom, transparent, ${cardBg})`,
            opacity: isHovered ? 0 : 1,
          }}
        />

        {template.isPremium && (
          <div className="absolute right-3 top-3 z-10 transition-transform duration-500 group-hover/card:scale-105">
            <span
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md"
              style={{
                background: "linear-gradient(135deg, #d4af37, #f5c842)",
                color: "#1a0a0f",
              }}
            >
              <Crown size={10} fill="currentColor" />
              Premium
            </span>
          </div>
        )}

        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-500 ${
            isHovered && iframeLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        ></div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5 pt-3 relative">
        <h3
          className="text-lg font-bold leading-snug tracking-wide transition-colors duration-300 group-hover/card:text-[#d4af37]"
          style={{ color: titleColor }}
        >
          {template.name}
        </h3>

        <p
          className="text-xs leading-relaxed line-clamp-2 h-9"
          style={{ color: descColor }}
        >
          {template.description ||
            "Chưa có mô tả chi tiết cho mẫu thiết kế này."}
        </p>

        <div className="h-px my-1.5" style={{ background: divider }} />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {template.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider transition-all duration-300 group-hover/card:bg-[#d4af37]/20"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  color: "#f5c842",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {template.viewCount !== undefined && (
            <span
              className="flex items-center gap-1 text-[11px] font-medium"
              style={{ color: "#8a7a6a" }}
            >
              <Eye size={12} />
              {template.viewCount} lượt xem
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TemplateSection() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    templateService
      .getTemplates({ page: 1, limit: 10 })
      .then((res) => setTemplates(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTemplateClick = (slug: string) => {
    router.push(`/templates?slug=${slug}`);
  };

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-275 mx-auto text-center">
          <p className="text-[#c9a98a] animate-pulse">
            Đang tải những mẫu thiệp cưới tinh tế nhất...
          </p>
        </div>
      </section>
    );
  }

  if (!templates.length) return null;

  return (
    <section className="py-24 px-6 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-[#1a0a0f]/20 to-transparent pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Tuyệt tác nghệ thuật số
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Chọn Mẫu Thiệp Bạn Yêu Thích
              </span>
            </h2>
            <p className="text-xs text-[#c9a98a]/80 max-w-137.5 mx-auto leading-relaxed mt-4 uppercase tracking-widest font-cormorant">
              Sáng tạo thiệp cưới mang dấu ấn riêng với các tính năng tương tác
              tối tân
            </p>
          </div>
        </ScrollReveal>

        <Carousel
          colors={{
            accent: "#d4af37",
            buttonBg: "rgba(26, 10, 15, 0.95)",
            buttonHoverBg: "rgba(212, 175, 55, 0.25)",
            dotInactive: "rgba(212, 175, 55, 0.2)",
          }}
          sizes={{ itemWidth: "330px", itemHeight: "500px" }}
        >
          {templates.map((template) => (
            <CarouselItem
              key={template.id}
              gradient="transparent"
              hoverEffect={false}
              colors={{
                accent: "#d4af37",
                borderInactive: "rgba(212,175,55,0.15)",
                shadowActive:
                  "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.15)",
              }}
              onItemClick={() => handleTemplateClick(template.slug)}
            >
              <TemplateCard template={template} />
            </CarouselItem>
          ))}
        </Carousel>

        <ScrollReveal>
          <div className="text-center mt-16">
            <a
              href="/templates"
              className="inline-flex items-center gap-3 px-10 py-4 border border-[#d4af37] text-[#d4af37] text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[rgba(212,175,55,0.08)] transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <Sparkles size={14} />
              Khám phá toàn bộ {templates.length}+ mẫu
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
