"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function HostsSection({ data, config, variant }: SectionRenderProps) {
  const tokens = config.tokens;
  const groom = data.groom as Record<string, string> | undefined;
  const bride = data.bride as Record<string, string> | undefined;

  if (variant === "familyInfo") {
    const father = groom?.father || bride?.father;
    const mother = groom?.mother || bride?.mother;
    if (!father && !mother) return null;
    return (
      <section className="px-6 py-6 text-center">
        <p className="text-sm leading-relaxed" style={{ color: tokens.colors.textSecondary }}>
          {father && <>Ông {father}</>}
          {father && mother && " · "}
          {mother && <>Bà {mother}</>}
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 py-8 text-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {groom?.name && (
          <div>
            <p className="text-xs uppercase tracking-widest opacity-70">{String(data.groomLabel || "Chú rể")}</p>
            <h2 className="text-3xl" style={{ fontFamily: tokens.fonts.script, color: tokens.colors.accent }}>
              {groom.shortName || groom.name}
            </h2>
          </div>
        )}
        {groom?.name && bride?.name && (
          <span style={{ color: tokens.colors.accent, fontSize: "1.5rem" }}>&amp;</span>
        )}
        {bride?.name && (
          <div>
            <p className="text-xs uppercase tracking-widest opacity-70">{String(data.brideLabel || "Cô dâu")}</p>
            <h2 className="text-3xl" style={{ fontFamily: tokens.fonts.script, color: tokens.colors.accent }}>
              {bride.shortName || bride.name}
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
