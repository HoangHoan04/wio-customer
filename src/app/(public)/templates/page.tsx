"use client";

import TemplateDetailModal from "@/components/templates/TemplateDetailModal";
import { templateService, type ITemplate } from "@/services/template.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const C = {
  bg: "#0b0507",
  bgCard: "#140a0d",
  gold: "#c5a059",
  goldLight: "#e5c483",
  cream: "#f9f6f0",
  muted: "#a38a75",
  border: "rgba(197, 160, 89, 0.15)",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filtered, setFiltered] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "free" | "premium">(
    "all",
  );
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    templateService
      .getTemplates({ skip: 0, take: 50, where: { isShow: true } })
      .then((res) => {
        setTemplates(res.data ?? []);
        setFiltered(res.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (filterType === "all") setFiltered(templates);
    else
      setFiltered(
        templates.filter((t) =>
          filterType === "premium" ? t.isPremium : !t.isPremium,
        ),
      );
  }, [filterType, templates]);

  return (
    <div
      className="min-h-screen pt-35 px-6 pb-20"
      style={{ background: C.bg, color: C.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600&display=swap');
        .template-card { background: ${C.bgCard}; border-radius: 16px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); border: 1px solid ${C.border}; cursor: pointer; }
        .template-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(197,160,89,0.15); border-color: ${C.gold}; }
        .template-card .info { padding: 20px; background: linear-gradient(to bottom, rgba(20,10,13,0.8), rgba(11,5,7,0.95)); border-top: 1px solid rgba(197,160,89,0.05); }
        .template-card:hover .info { background: rgba(11,5,7,0.98); border-top-color: rgba(197,160,89,0.2); }
      `}</style>

      <div className="text-center max-w-175 mx-auto mb-16">
        <h1
          className="text-[2.8rem] font-bold mb-5 uppercase tracking-wider"
          style={{
            fontFamily: "'Cinzel', serif",
            background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 50%, ${C.goldLight} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Thư Viện Mẫu Thiệp Cưới
        </h1>
        <p
          className="text-base leading-relaxed font-light"
          style={{ color: C.muted }}
        >
          Khám phá những tác phẩm thiệp cưới nghệ thuật cao cấp, được chế tác
          độc quyền với trải nghiệm hiệu ứng tương tác sang trọng, tinh tế.
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-12">
        {(["all", "free", "premium"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider rounded transition-all duration-300 ${
              filterType === type
                ? "text-[#0b0507] shadow-lg"
                : "text-[#a38a75] border border-[rgba(197,160,89,0.15)] hover:border-[#c5a059]"
            }`}
            style={
              filterType === type
                ? {
                    background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
                    boxShadow: "0 4px 15px rgba(197,160,89,0.3)",
                  }
                : {}
            }
          >
            {type === "all"
              ? "Tất cả"
              : type === "free"
                ? "Miễn phí"
                : "Premium"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-300 mx-auto">
          {filtered.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => {
                setSelectedTemplate(tpl);
                setIsDetailModalOpen(true);
              }}
              className="template-card no-underline text-left w-full"
            >
              <div
                className="relative w-full"
                style={{ paddingTop: "135%", background: "#000" }}
              >
                {tpl.thumbnailUrl && (
                  <img
                    src={tpl.thumbnailUrl}
                    alt={tpl.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="info">
                <h3
                  className="text-lg font-semibold mb-1.5 tracking-wide"
                  style={{ fontFamily: "'Cinzel', serif", color: C.cream }}
                >
                  {tpl.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(tpl.tags ?? ["Truyền thống", "Sang trọng"])
                    .slice(0, 3)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "#b0a0a5",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div
                  className="flex justify-between items-center text-xs"
                  style={{ color: C.muted }}
                >
                  <span>{tpl.viewCount ?? 0} lượt dùng</span>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
                      tpl.isPremium
                        ? "text-[#e5c483] border border-[#c5a059]"
                        : "text-[#f9f6f0] border border-[rgba(249,246,240,0.15)]"
                    }`}
                    style={
                      tpl.isPremium
                        ? { background: "rgba(197,160,89,0.12)" }
                        : { background: "rgba(249,246,240,0.05)" }
                    }
                  >
                    {tpl.isPremium ? "Premium" : "Miễn Phí"}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div
              className="col-span-full text-center py-20 border border-dashed rounded-xl"
              style={{ color: C.muted, borderColor: C.border }}
            >
              Hiện tại chưa có mẫu thiệp nào thuộc danh mục này.
            </div>
          )}
        </div>
      )}

      <div
        className="max-w-300 mx-auto mt-20 p-12 sm:p-16 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(197,160,89,0.07) 0%, rgba(20,10,13,0.85) 55%, rgba(11,5,7,0.9) 100%)`,
          border: "1px solid rgba(197,160,89,0.22)",
        }}
      >
        <div
          className="absolute -right-15 top-1/2 -translate-y-1/2 w-100 h-100 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(197,160,89,0.1) 0%, transparent 65%)",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-linear-to-b from-transparent via-[#e5c483] to-transparent max-sm:w-auto max-sm:h-0.75 max-sm:inset-x-0 max-sm:top-0 max-sm:bottom-auto" />
        <div className="relative z-1 flex-1">
          <div
            className="inline-flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: C.gold }}
          >
            <span className="w-6 h-px bg-[#c5a059] opacity-60" />
            Sáng tạo không giới hạn
            <span className="w-6 h-px bg-[#c5a059] opacity-60" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight tracking-wide"
            style={{ fontFamily: "'Cinzel', serif", color: C.cream }}
          >
            Bạn đã có ý tưởng
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              cho riêng mình?
            </span>
          </h2>
          <p
            className="text-sm leading-relaxed font-light max-w-125"
            style={{ color: C.muted }}
          >
            Đừng bó hẹp trong khuôn mẫu có sẵn. Hãy bắt đầu từ trang trắng và tự
            tay thiết kế thiệp cưới mang dấu ấn cá nhân.
          </p>
        </div>
        <div className="relative z-1 shrink-0">
          <Link
            href="/design"
            className="inline-flex items-center gap-3 px-10 py-4.5 rounded-md text-sm font-bold uppercase tracking-wider shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)`,
              color: C.bg,
              boxShadow:
                "0 8px 28px rgba(197,160,89,0.35), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            Tự tạo thiệp ngay
          </Link>
        </div>
      </div>

      <TemplateDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}
