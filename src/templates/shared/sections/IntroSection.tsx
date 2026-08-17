"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function IntroSection({ data, config }: SectionRenderProps) {
  if (!data.showIntro || !data.introText) return null;
  return (
    <section className="px-6 py-8 text-center">
      <p
        className="mx-auto max-w-lg whitespace-pre-line text-base leading-relaxed md:text-lg"
        style={{ fontFamily: config.tokens.fonts.body, color: config.tokens.colors.textPrimary }}
      >
        {String(data.introText)}
      </p>
    </section>
  );
}
