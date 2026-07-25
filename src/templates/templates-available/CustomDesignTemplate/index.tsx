"use client";

import { useEffect, useState } from "react";
import Canvas from "@/templates/customer-design/Canvas";
import type { EditorElement } from "@/templates/customer-design/types";

export default function CustomDesignTemplate({ data }: { data: any }) {
  const customDesign = data?.customDesign;
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [canvasHeight, setCanvasHeight] = useState(956);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    if (customDesign) {
      try {
        const parsed = typeof customDesign === "string" ? JSON.parse(customDesign) : customDesign;
        if (parsed.elements) setElements(parsed.elements);
        if (parsed.canvasBackground) setCanvasBackground(parsed.canvasBackground);
        if (parsed.backgroundOpacity !== undefined) setBackgroundOpacity(parsed.backgroundOpacity);
        if (parsed.canvasHeight) setCanvasHeight(parsed.canvasHeight);
      } catch (e) {
        console.error("Failed to parse customDesign data", e);
      }
    }

    return () => {
      document.head.removeChild(link);
    };
  }, [customDesign]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const mobile = screenWidth <= 480;
      setIsMobile(mobile);

      if (mobile) {
        setScale(screenWidth / 440);
      } else {
        const availableWidth = screenWidth - 32;
        const newScale = Math.min(1, availableWidth / 440);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!customDesign) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdfbf7] text-[#666] font-sans">
        <p className="text-sm font-semibold">Thiệp cưới này chưa được hoàn tất thiết kế.</p>
      </div>
    );
  }

  return (
    <div
      className={
        isMobile
          ? "min-h-screen bg-[#0a0508] flex flex-col items-center select-none overflow-x-hidden p-0"
          : "min-h-screen bg-[#0a0508] flex flex-col items-center justify-center select-none overflow-x-hidden p-4"
      }
    >
      <div
        style={{
          width: 440 * scale,
          height: canvasHeight * scale,
          position: "relative",
          boxShadow: isMobile ? "none" : "0 20px 50px rgba(0,0,0,0.6)",
          borderRadius: isMobile ? "0px" : "8px",
          overflow: "hidden",
        }}
      >
        <Canvas
          elements={elements}
          selectedElementId={null}
          canvasBackground={canvasBackground}
          backgroundOpacity={backgroundOpacity}
          zoom={100}
          canvasWidth={440}
          canvasHeight={canvasHeight}
          onSelect={() => {}}
          onUpdate={() => {}}
          onDragEnd={() => {}}
          onTransformEnd={() => {}}
          readOnly={true}
        />
      </div>
    </div>
  );
}
