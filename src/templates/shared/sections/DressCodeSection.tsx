"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function DressCodeSection({ data, config }: SectionRenderProps) {
  if (!data.showDressCode) return null;
  const codes = (data.dressCodes as string[]) || [];
  if (!codes.length) return null;
  return (
    <section className="px-6 py-8 text-center">
      <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: config.tokens.fonts.heading }}>
        Dress code
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {codes.map((code) => (
          <span
            key={code}
            className="rounded-full px-4 py-2 text-sm"
            style={{ background: `${config.tokens.colors.accent}15`, color: config.tokens.colors.textPrimary }}
          >
            {code}
          </span>
        ))}
      </div>
    </section>
  );
}
