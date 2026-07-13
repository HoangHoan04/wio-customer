"use client";

import Modal from "@/components/ui/Modal";
import { type ITemplate } from "@/services/template.service";
import { Eye, Heart, Info, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface TemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ITemplate | null;
}

const PREVIEW_WIDTH = 390;
const PREVIEW_SCALE = 0.72;
const SCROLL_SPEED = 1;

export default function TemplateDetailModal({
  isOpen,
  onClose,
  template,
}: TemplateDetailModalProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

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
        } catch { }
      }, 25);
    } else {
      stopAutoScroll();
    }
    return stopAutoScroll;
  }, [isHovered, iframeLoaded]);

  useEffect(() => {
    if (!isOpen) {
      setIsHovered(false);
      setIframeLoaded(false);
      stopAutoScroll();
    }
  }, [isOpen]);

  if (!template) return null;

  const handleCreate = () => {
    onClose();
    router.push(`/create/${template.slug}`);
  };

  const handlePreview = () => {
    window.open(`/preview/${template.slug}`, "_blank");
  };

  const features: string[] = Array.isArray(template.features)
    ? template.features
    : Array.isArray(template.features?.list)
      ? template.features.list
      : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[750px]"
      closeOnBackdropClick={true}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

      <div className="flex flex-col md:flex-row gap-6 mt-2 text-left">
        <div className="w-full md:w-70 shrink-0">
          <div
            className="relative rounded-xl overflow-hidden border border-[#d4af37]/20 shadow-lg cursor-pointer"
            style={{ aspectRatio: "3/4" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={template.thumbnailUrl}
              alt={template.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? "opacity-0" : "opacity-100"
                }`}
            />

            <div
              className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"
                }`}
            >
              <iframe
                ref={iframeRef}
                src={`/preview/${template.slug}?hover=true`}
                title={`Preview ${template.name}`}
                onLoad={() => setIframeLoaded(true)}
                style={{
                  width: `${PREVIEW_WIDTH}px`,
                  height: `${Math.round(PREVIEW_WIDTH / PREVIEW_SCALE)}px`,
                  transform: `scale(${PREVIEW_SCALE})`,
                  transformOrigin: "top left",
                  border: "none",
                  pointerEvents: "none",
                  display: "block",
                }}
              />
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 h-14 bg-linear-to-t from-black/60 to-transparent flex items-end justify-center pb-2.5 transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"
                }`}
            >
              <span className="text-white/65 text-[10px] font-medium tracking-wider flex items-center gap-1.5">
                <Eye size={11} />
                Di chuột để xem trước
              </span>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-black/40 to-transparent flex items-end justify-center pb-2 transition-opacity duration-300 ${isHovered && iframeLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
              <span className="text-white/50 text-[9px] font-medium tracking-widest flex items-center gap-1 animate-pulse">
                ▼ ĐANG CUỘN
              </span>
            </div>

            {template.isPremium && (
              <span className="absolute top-3 left-3 z-10 bg-[#d4af37] text-[#0a0508] px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-md flex items-center gap-1 shadow-md">
                <Sparkles size={11} fill="currentColor" />
                PREMIUM
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <div>
            <h2 className="text-3xl tracking-[2px] text-[#d4af37] uppercase font-bold">
              {template.name}
            </h2>

            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {template.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#d4af37]/10 text-[#f5c842] border border-[#d4af37]/25 px-2 py-0.5 rounded text-[10px] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-[#f5e6d3]/80 text-[13.5px] leading-relaxed">
            {template.description}
          </p>

          <div className="grid grid-cols-2 gap-3 bg-white/3 border border-[#d4af37]/10 p-3 rounded-lg text-xs text-[#f5e6d3]/80">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-[#d4af37]" />
              <span>
                Dùng thử: <strong>{template.trialDays} ngày</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#d4af37]" />
              <span>
                Gói tối thiểu:{" "}
                <strong className="uppercase">{template.minPlan}</strong>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">
              Tính năng nổi bật
            </h4>
            {features.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#f5e6d3]/70 list-none pl-0">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#d4af37] text-[10px] mt-0.5">◆</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#f5e6d3]/40 italic">
                Chưa có thông tin tính năng.
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex-1 py-2.5 bg-white/3! border-[#d4af37]/20! hover:border-[#d4af37]/40! text-[#f5e6d3]! flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            >
              <Eye size={16} />
              Xem trước
            </Button>
            <Button
              variant="default"
              onClick={handleCreate}
              className="flex-1 py-2.5 bg-linear-to-r from-[#d4af37] to-[#f5c842] hover:opacity-95! text-[#0a0508] font-bold flex items-center justify-center rounded-xl text-sm transition-all transform active:scale-98"
            >
              <Heart size={16} fill="currentColor" />
              Tạo thiệp
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
