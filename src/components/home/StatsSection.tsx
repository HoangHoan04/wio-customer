"use client";

import { statsService } from "@/services/stats.service";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface StatItem {
  number: number;
  suffix: string;
  label: string;
}

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

function Counter({ target, duration = 1500, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
    setCount(0);

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
            setCount(Math.floor(currentVal));

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
  }, [target, duration]);

  const formatNumber = (val: number): string => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <span ref={elementRef}>
      {formatNumber(count)}
      {suffix ? (
        <span className="text-[#2D231F] ml-0.5 font-normal select-none">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    statsService
      .getPublicOverview()
      .then((data) => {
        if (cancelled) return;
        setStats([
          {
            number: data.publishedInvitations,
            suffix: "",
            label: "Thiệp đã xuất bản",
          },
          {
            number: data.templates,
            suffix: "",
            label: "Mẫu thiệp",
          },
          {
            number: data.guests,
            suffix: "",
            label: "Khách mời",
          },
        ]);
      })
      .catch(() => {
        if (cancelled) return;
        setStats([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && stats.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden border-y border-[#2D231F]/15 py-12 px-6"
      style={{
        background: `radial-gradient(circle at center, #EDE4D5 0%, #F3EDE3 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45, 35, 31,0.03)_0%,transparent_70%)] pointer-events-none" />

      <ScrollReveal>
        <div className="max-w-275 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative z-10">
          {(loading
            ? [
                { number: 0, suffix: "", label: "Thiệp đã xuất bản" },
                { number: 0, suffix: "", label: "Mẫu thiệp" },
                { number: 0, suffix: "", label: "Khách mời" },
              ]
            : stats
          ).map((s, i) => (
            <div
              key={s.label}
              className={`group text-center py-6 px-4 transition-all duration-500 hover:transform hover:-translate-y-1 ${
                i < 2
                  ? "md:border-r border-b md:border-b-0 border-[#2D231F]/10"
                  : ""
              }`}
            >
              <div className="tct-shimmer-text text-[clamp(2.5rem,5vw,3.5rem)] font-light block mb-2   tracking-tight leading-none">
                {loading ? (
                  <span className="inline-block h-[0.9em] w-16 animate-pulse rounded bg-[#2D231F]/10" />
                ) : (
                  <Counter target={s.number} suffix={s.suffix} />
                )}
              </div>
              <div className="text-[11px] text-[#7A6A5C]/80 tracking-[0.2em] uppercase font-medium transition-colors duration-300 group-hover:text-[#7A6A5C]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
