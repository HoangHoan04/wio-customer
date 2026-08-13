"use client";

import { reviewService, type PublicReview } from "@/services/review.service";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

function initialFromName(name: string): string {
  const ch = name.trim().charAt(0);
  return ch ? ch.toUpperCase() : "?";
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    reviewService
      .listPublic(6)
      .then((list) => {
        if (!cancelled) setReviews(list);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section
      className="py-28 px-6 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, #EDE4D5 0%, #F3EDE3 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-300 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
              Khách hàng nói gì
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light tracking-wide leading-tight font-cormorant">
              <span className="tct-shimmer-text italic block">
                Khoảnh khắc trọn vẹn niềm vui
              </span>
            </h2>
            <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {reviews.map((t) => (
            <ScrollReveal key={t.id || t.authorName}>
              <div
                className="group relative h-full flex flex-col p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
                  borderColor: "rgba(45, 35, 31, 0.12)",
                }}
              >
                <Quote
                  className="absolute right-6 top-6 w-16 h-16 text-[#2D231F]/3 transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                  strokeWidth={1}
                />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(45, 35, 31,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={13}
                      className="text-[#C4A574] fill-[#C4A574]"
                    />
                  ))}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <p
                    className="text-[13.5px] text-[#7A6A5C]/90 leading-relaxed italic mb-8"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t border-[#2D231F]/10 pt-5">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full border border-[#2D231F]/30 flex items-center justify-center p-0.5">
                        {t.avatarUrl ? (
                          <img
                            src={t.avatarUrl}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#EDE4D5] border border-[#D9CDBE] flex items-center justify-center text-sm font-semibold text-[#2D231F]">
                            {initialFromName(t.authorName)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-xs text-[#2D231F] tracking-wider">
                        {t.authorName}
                      </div>
                      {t.eventLabel ? (
                        <div className="text-[10px] text-[#7A6A5C]/50 uppercase tracking-widest mt-1">
                          {t.eventLabel}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 border border-[#2D231F]/0 rounded-2xl transition-all duration-500 group-hover:border-[#2D231F]/25 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
