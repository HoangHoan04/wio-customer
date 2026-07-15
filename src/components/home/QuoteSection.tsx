"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const QUOTE_TEXT =
  "Một tấm thiệp cưới đẹp không chỉ là lời mời, mà còn là dấu ấn đầu tiên khắc sâu trong ký ức của tất cả những ai được chứng kiến ngày trọng đại ấy.";

export default function QuoteSection() {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setStartTyping(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setStartTyping(true);
        }
      },
      { threshold: 0.3 },
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!startTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < QUOTE_TEXT.length) {
        setDisplayedText(QUOTE_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [startTyping]);

  return (
    <div
      ref={sectionRef}
      className="border-y border-[#d4af37]/20 py-24 px-6 text-center relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, #2a101f 0%, #0f0608 100%)`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,175,55,0.04) 0%, transparent 60%)",
        }}
      />

      <ScrollReveal>
        <div className="relative max-w-3xl mx-auto flex flex-col items-center justify-center">
          <span
            className="text-[#d4af37]/20 text-6xl   block mb-2 select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            “
          </span>

          <p
            className="italic text-[clamp(1.2rem,2.8vw,2rem)] text-[#f5e6d3] leading-relaxed min-h-30 md:min-h-40 font-medium "
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {displayedText}
            <span className="inline-block w-1.5 h-[1.1em] bg-[#d4af37] ml-1 animate-[pulse_1s_infinite] align-middle" />
          </p>

          <span
            className="text-[#d4af37]/20 text-6xl   block mt-2 select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ”
          </span>

          <p className="text-[10px] tracking-[6px] text-[#d4af37] uppercase font-semibold mt-6 transition-all duration-700">
            — Tiệm cưới tân thời —
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
