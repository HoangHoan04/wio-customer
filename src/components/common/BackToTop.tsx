"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GOLD_START = "#d4af37";
const GOLD_END = "#f5c842";
const DARK = "#1a0a0f";

export default function BackToTop({ threshold = 200 }: { threshold?: number }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

        setScrollProgress(progress);
        setIsVisible(scrollTop > threshold);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname, threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              onClick={scrollToTop}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Cuộn lên đầu trang"
              className="group relative flex items-center justify-center size-13 rounded-full border-none shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${GOLD_START} 0%, ${GOLD_END} 100%)`,
                boxShadow: "0 4px 20px rgba(212,175,55,0.45)",
              }}
            >
              <svg className="absolute inset-0 size-full -rotate-90">
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  stroke="rgba(26,10,15,0.2)"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  stroke={DARK}
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              </svg>

              <Rocket
                className="size-5 transition-transform duration-300 ease-out"
                style={{
                  color: DARK,
                  transform: `rotate(-45deg) ${isHovered ? "scale(1.18)" : "scale(1)"}`,
                  transformOrigin: "center",
                }}
              />
            </button>
          }
        />
        <TooltipContent side="top" sideOffset={8}>
          Cuộn lên đầu trang
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
