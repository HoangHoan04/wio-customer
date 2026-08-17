"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function HeroSection({ data, config }: SectionRenderProps) {
  if (!data.showHeroImage) return null;
  const tokens = config.tokens;
  const heroStyle = config.layout.heroStyle;
  const groom = data.groom as { photo?: string; name?: string; shortName?: string; title?: string };
  const bride = data.bride as { photo?: string; name?: string; shortName?: string; title?: string };

  if (heroStyle === "split" && groom && bride) {
    const isGroomFirst = data.displayOrder !== "bride_first";
    const top = isGroomFirst ? groom : bride;
    const bottom = isGroomFirst ? bride : groom;
    return (
      <section className="relative px-4 py-8">
        <div className="mx-auto max-w-md">
          <PersonCard person={top} config={config} rotate="rotate-[3deg]" align="start" />
          <PersonCard person={bottom} config={config} rotate="-rotate-[4deg]" align="end" className="-mt-16" />
        </div>
      </section>
    );
  }

  const heroUrl = String(data.heroImageMain || groom?.photo || bride?.photo || "");
  if (!heroUrl) return null;

  return (
    <section className="px-4 py-8">
      <div
        className="mx-auto max-w-lg overflow-hidden rounded-2xl shadow-xl"
        style={{ border: `1px solid ${tokens.colors.accent}33` }}
      >
        <img src={heroUrl} alt="Hero" className="h-80 w-full object-cover md:h-96" />
      </div>
    </section>
  );
}

function PersonCard({
  person,
  config,
  rotate,
  align,
  className = "",
}: {
  person: { photo?: string; name?: string; shortName?: string; title?: string };
  config: SectionRenderProps["config"];
  rotate: string;
  align: "start" | "end";
  className?: string;
}) {
  const tokens = config.tokens;
  return (
    <div className={`flex ${align === "end" ? "justify-end pr-4" : "justify-start pl-4"} ${className}`}>
      <div className={`relative w-48 bg-white p-3 pb-10 shadow-lg ${rotate} md:w-56`}>
        <img
          src={person.photo || "https://placehold.co/300x400"}
          alt={person.name}
          className="h-56 w-full object-cover"
        />
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-[10px] uppercase tracking-widest opacity-70">{person.title}</span>
          <h2 style={{ fontFamily: tokens.fonts.script, color: tokens.colors.accent }} className="text-2xl">
            {person.shortName || person.name}
          </h2>
        </div>
      </div>
    </div>
  );
}
