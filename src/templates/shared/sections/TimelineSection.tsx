"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function TimelineSection({ data, config }: SectionRenderProps) {
  if (!data.showTimeline) return null;
  const items = (data.timeline as Array<{ time?: string; title?: string }>) || [];
  if (!items.length) return null;
  const tokens = config.tokens;
  return (
    <section className="px-6 py-8">
      <h3 className="mb-6 text-center text-xl font-semibold" style={{ fontFamily: tokens.fonts.heading }}>
        {String(data.timelineTitle || "Lịch trình")}
      </h3>
      <div className="mx-auto max-w-md space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-16 shrink-0 text-sm font-semibold" style={{ color: tokens.colors.accent }}>
              {item.time}
            </div>
            <div className="flex-1 border-l pl-4" style={{ borderColor: `${tokens.colors.accent}44` }}>
              <p style={{ color: tokens.colors.textPrimary }}>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
