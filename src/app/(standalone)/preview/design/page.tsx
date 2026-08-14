"use client";

import Canvas from "@/templates/customer-design/Canvas";
import type {
  EditorElement,
  InvitationEffects,
} from "@/templates/customer-design/types";
import {
  DEFAULT_INVITATION_EFFECTS,
  normalizeEffects,
} from "@/templates/customer-design/utils/invitation-effects";
import { ArrowLeftIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function DesignPreviewContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Xem trước thiết kế";

  const [elements, setElements] = useState<EditorElement[]>([]);
  const [canvasBackground, setCanvasBackground] = useState<any>({
    type: "color",
    value: "#ffffff",
  });
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [canvasHeight, setCanvasHeight] = useState(956);
  const [scale, setScale] = useState(1);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [effects, setEffects] = useState<InvitationEffects>(
    DEFAULT_INVITATION_EFFECTS,
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("invigo_design_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.elements) setElements(parsed.elements);
        if (parsed.canvasBackground)
          setCanvasBackground(parsed.canvasBackground);
        if (parsed.backgroundOpacity !== undefined)
          setBackgroundOpacity(parsed.backgroundOpacity);
        if (parsed.canvasHeight) setCanvasHeight(parsed.canvasHeight);
        if (parsed.effects) setEffects(normalizeEffects(parsed.effects));
      }
    } catch (e) {
      console.error("Failed to load draft for preview", e);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.fonts.ready
        .then(() => {
          setFontsLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load document fonts", err);
          setFontsLoaded(true);
        });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const mobile = screenWidth <= 480;
      setIsMobile(mobile);

      if (mobile) {
        setScale(screenWidth / 440);
      } else {
        const availableWidth = screenWidth - 32 - 16;
        const newScale = Math.min(1, availableWidth / 440);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={
        isMobile
          ? "h-screen bg-[#ffffff] flex flex-col select-none overflow-hidden p-0"
          : "h-screen bg-[#ffffff] flex flex-col items-center justify-center select-none overflow-hidden p-4"
      }
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        
        *::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `}</style>

      <div
        className={
          isMobile
            ? "flex items-center justify-between w-full mb-3 px-4 pt-4 shrink-0"
            : "flex items-center justify-between w-full mb-3 px-2 shrink-0"
        }
        style={
          isMobile
            ? undefined
            : { width: `${440 * scale + 16}px`, maxWidth: "100%" }
        }
      >
        <button
          onClick={() => window.close()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#2D231F]/80 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer border border-white/10"
        >
          <ArrowLeftIcon size={14} />
          Đóng
        </button>
        <span className="text-gray-400 text-xs font-medium truncate max-w-70">
          {title}
        </span>
      </div>

      <div
        className={
          isMobile
            ? "preview-canvas-container relative bg-[#1a1a1a] flex-1 overflow-hidden flex flex-col"
            : "preview-canvas-container relative bg-[#1a1a1a] rounded-[32px] border-8 border-[#222] shadow-2xl overflow-hidden flex flex-col"
        }
        style={
          isMobile
            ? { width: "100%" }
            : {
                width: `${440 * scale + 16}px`,
                maxWidth: "100%",
                height: "calc(100vh - 80px)",
              }
        }
      >
        {elements.length > 0 && fontsLoaded && (
          <Canvas
            elements={elements}
            selectedElementId={null}
            canvasBackground={canvasBackground}
            backgroundOpacity={backgroundOpacity}
            zoom={scale * 100}
            canvasWidth={440}
            canvasHeight={canvasHeight}
            onSelect={() => {}}
            onUpdate={() => {}}
            onDragEnd={() => {}}
            onTransformEnd={() => {}}
            readOnly={true}
            effects={effects}
          />
        )}
      </div>
    </div>
  );
}

export default function DesignPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#ffffff] flex items-center justify-center text-[#2D231F] font-sans">
          Đang tải bản xem trước...
        </div>
      }
    >
      <DesignPreviewContent />
    </Suspense>
  );
}
