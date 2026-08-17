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
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const eased = progress * (2 - progress);
          setCount(Math.floor(eased * target));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.1 },
    );

    const node = elementRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [target, duration]);

  const formatted = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <span ref={elementRef}>
      {formatted}
      {suffix ? (
        <span className="ml-0.5 font-normal text-[#2D231F] select-none">{suffix}</span>
      ) : null}
    </span>
  );
}

const PLACEHOLDER_STATS: StatItem[] = [
  { number: 0, suffix: "", label: "Thiệp đã xuất bản" },
  { number: 0, suffix: "", label: "Mẫu thiệp" },
  { number: 0, suffix: "", label: "Đánh giá" },
];

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
            number: data.reviews,
            suffix: "",
            label: "Đánh giá",
          },
        ]);
      })
      .catch(() => {
        if (!cancelled) setStats([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && stats.length === 0) return null;

  const items = loading ? PLACEHOLDER_STATS : stats;

  return (
    <div
      className="relative my-4 overflow-hidden border-y border-[#2D231F]/15 px-6 py-14 sm:my-8 sm:py-18"
      style={{
        background: "radial-gradient(circle at center, #EDE4D5 0%, #F3EDE3 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,35,31,0.03)_0%,transparent_70%)]" />

      <ScrollReveal>
        <div className="relative z-10 mx-auto grid max-w-275 grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`group px-4 py-6 text-center transition-all duration-500 hover:-translate-y-1 ${
                index < 2
                  ? "border-b border-[#2D231F]/10 md:border-r md:border-b-0"
                  : ""
              }`}
            >
              <div className="tct-shimmer-text mb-2 block text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-light tracking-tight">
                {loading ? (
                  <span className="inline-block h-[0.9em] w-16 animate-pulse rounded bg-[#2D231F]/10" />
                ) : (
                  <Counter target={item.number} suffix={item.suffix} />
                )}
              </div>
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#7A6A5C]/80 uppercase transition-colors duration-300 group-hover:text-[#7A6A5C]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
