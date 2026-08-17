"use client";

import TemplateDetailModal from "@/components/templates/TemplateDetailModal";
import {
  cardTypeService,
  FALLBACK_CARD_TYPES,
  type ICardType,
} from "@/services/card-type.service";
import { templateService, type ITemplate } from "@/services/template.service";
import { filterPublicTemplates, PUBLIC_TEMPLATE_WHERE } from "@/utils/template-filters";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const C = {
  bg: "#F3EDE3",
  bgCard: "#EDE4D5",
  gold: "#2D231F",
  goldLight: "#7A6A5C",
  cream: "#2D231F",
  muted: "#7A6A5C",
  border: "#D9CDBE",
};

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const typeSlug = searchParams.get("type");
  const [cardTypes, setCardTypes] = useState<ICardType[]>(FALLBACK_CARD_TYPES);
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

  const selectedCardType = cardTypes.find(
    (item) => item.slug === typeSlug || item.code === typeSlug,
  );

  useEffect(() => {
    cardTypeService.listActive().then(setCardTypes).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    templateService
      .getTemplates({
        skip: 0,
        take: 50,
        where: {
          ...PUBLIC_TEMPLATE_WHERE,
          ...(selectedCardType?.code
            ? { cardType: selectedCardType.code }
            : {}),
        },
      })
      .then((res) => {
        const items = filterPublicTemplates(res.data);
        setTemplates(items);
        setFiltered(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCardType?.code]);

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
        .template-card { background: ${C.bgCard}; border-radius: 4px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); border: 1px solid ${C.border}; cursor: pointer; }
        .template-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(45,35,31,0.12); border-color: ${C.gold}; }
        .template-card .info { padding: 20px; background: ${C.bg}; border-top: 1px solid ${C.border}; }
        .template-card:hover .info { background: ${C.bgCard}; }
      `}</style>

      <div className="text-center max-w-175 mx-auto mb-16">
        <h1
          className="text-[2.8rem] font-bold mb-5 uppercase tracking-wider text-[#2D231F]"
          style={{
            fontFamily: "'Cinzel', serif",
          }}
        >
          Thư viện {selectedCardType ? selectedCardType.nameVi.toLowerCase() : "mẫu thiệp"}
        </h1>
        <p
          className="text-base leading-relaxed font-light"
          style={{ color: C.muted }}
        >
          {selectedCardType
            ? `Chọn mẫu ${selectedCardType.nameVi.toLowerCase()} rồi tùy chỉnh nội dung theo dịp của bạn.`
            : "Chọn loại thiệp — cưới, sinh nhật, tốt nghiệp và nhiều dịp khác — rồi tùy chỉnh theo ý bạn."}
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-12">
        {(["all", "free", "premium"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider rounded transition-all duration-300 ${
              filterType === type
                ? "text-[#F3EDE3] shadow-lg"
                : "text-[#7A6A5C] border border-[#D9CDBE] hover:border-[#2D231F]/40 hover:text-[#2D231F]"
            }`}
            style={
              filterType === type
                ? {
                    background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
                    boxShadow: "0 4px 15px rgba(45, 35, 31,0.3)",
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
          <div className="w-12 h-12 border-4 border-[#2D231F]/20 border-t-[#2D231F] rounded-full animate-spin" />
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
                templateService.incrementPreview(tpl.id);
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
                        ? "text-[#7A6A5C] border border-[#2D231F]"
                        : "text-[#2D231F] border border-[rgba(249,246,240,0.15)]"
                    }`}
                    style={
                      tpl.isPremium
                        ? { background: "rgba(45, 35, 31,0.12)" }
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
          background: "#2A211C",
          border: "1px solid rgba(45, 35, 31,0.22)",
        }}
      >
        <div
          className="absolute -right-15 top-1/2 -translate-y-1/2 w-100 h-100 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(45, 35, 31,0.1) 0%, transparent 65%)",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-linear-to-b from-transparent via-[#C4B09A] to-transparent max-sm:w-auto max-sm:h-0.75 max-sm:inset-x-0 max-sm:top-0 max-sm:bottom-auto" />
        <div className="relative z-1 flex-1">
          <div
            className="inline-flex items-center gap-2.5 text-xs tracking-widest uppercase mb-4 font-light font-cormorant text-[#F3EDE3]/70"
            style={{
              fontFamily: "'Cinzel', serif",
            }}
          >
            <span className="w-6 h-px bg-[#F3EDE3]/40" />
            Sáng tạo không giới hạn
            <span className="w-6 h-px bg-[#F3EDE3]/40" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight tracking-wide font-cormorant text-[#F3EDE3]"
          >
            Bạn đã có ý tưởng
            <br />
            <span className="text-[#F3EDE3]">
              cho riêng mình?
            </span>
          </h2>
          <p className="text-sm leading-relaxed font-light max-w-125 text-[#F3EDE3]/70">
            Đừng bó hẹp trong khuôn mẫu có sẵn. Hãy bắt đầu từ trang trắng và tự
            tay thiết kế thiệp cưới mang dấu ấn cá nhân.
          </p>
        </div>
        <div className="relative z-1 shrink-0">
          <Link
            href={
              selectedCardType
                ? `/design?cardType=${encodeURIComponent(selectedCardType.code)}`
                : "/design"
            }
            className="inline-flex items-center gap-3 px-10 py-4.5 rounded-md text-sm font-bold uppercase tracking-wider shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{
              background: "#F3EDE3",
              color: "#2D231F",
              boxShadow: "0 8px 28px rgba(45, 35, 31,0.22)",
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
        cardType={selectedCardType?.code}
      />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-35 px-6 pb-20 bg-[#F3EDE3]" />
      }
    >
      <TemplatesPageContent />
    </Suspense>
  );
}
