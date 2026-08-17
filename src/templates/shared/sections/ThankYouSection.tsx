"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function ThankYouSection({ data, config }: SectionRenderProps) {
  if (data.showThankYou === false) return null;
  const text = String(data.thankYouText || "Cảm ơn bạn đã dành thời gian đọc thiệp!");
  return (
    <section className="px-6 py-12 text-center">
      <p
        className="mx-auto max-w-lg whitespace-pre-line text-base leading-relaxed"
        style={{ fontFamily: config.tokens.fonts.script, color: config.tokens.colors.accent, fontSize: "1.35rem" }}
      >
        {text}
      </p>
    </section>
  );
}
