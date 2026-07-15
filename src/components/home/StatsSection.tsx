import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface StatItem {
  number: number;
  suffix: string;
  label: string;
  isFloat?: boolean;
}

interface CounterProps {
  target: number;
  duration?: number;
  isFloat?: boolean;
  suffix?: string;
}

export const STATS: StatItem[] = [
  { number: 2400, suffix: "+", label: "Cặp đôi hạnh phúc" },
  { number: 14, suffix: "", label: "Mẫu thiệp cưới độc bản" },
  { number: 4.9, suffix: "★", label: "Đánh giá trung bình", isFloat: true },
];

function Counter({
  target,
  duration = 1500,
  isFloat = false,
  suffix = "",
}: CounterProps) {
  const [count, setCount] = useState<number | string>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = 0;
          const end = target;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress);
            const currentVal = start + easeProgress * (end - start);

            if (isFloat) {
              setCount(currentVal.toFixed(1));
            } else {
              setCount(Math.floor(currentVal));
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 },
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [target, duration, isFloat]);

  const formatNumber = (val: number | string): string => {
    if (isFloat) return val.toString();
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <span ref={elementRef}>
      {formatNumber(count)}
      <span className="text-[#d4af37] ml-0.5 font-normal select-none">
        {suffix}
      </span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <div
      className="relative overflow-hidden border-y border-[#d4af37]/15 py-12 px-6"
      style={{
        background: `radial-gradient(circle at center, #2a1420 0%, #0f0608 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      <ScrollReveal>
        <div className="max-w-275 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative z-10">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`group text-center py-6 px-4 transition-all duration-500 hover:transform hover:-translate-y-1 ${
                i < STATS.length - 1
                  ? "md:border-r border-b md:border-b-0 border-[#d4af37]/10"
                  : ""
              }`}
            >
              <div className="tct-shimmer-text text-[clamp(2.5rem,5vw,3.5rem)] font-light block mb-2   tracking-tight leading-none">
                <Counter
                  target={s.number}
                  isFloat={s.isFloat}
                  suffix={s.suffix}
                />
              </div>
              <div className="text-[11px] text-[#c9a98a]/80 tracking-[0.2em] uppercase font-medium transition-colors duration-300 group-hover:text-[#d4af37]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
