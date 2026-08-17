"use client";

import { Music } from "lucide-react";
import { WelcomeIcon } from "@/assets/icons";
import type { PresetThemeConfig } from "../types/preset-theme.types";
import type { PresetThemeRenderData } from "../types/preset-theme.types";

export function EnvelopeWelcome({
  data,
  config,
  onOpen,
}: {
  data: PresetThemeRenderData;
  config: PresetThemeConfig;
  onOpen: () => void;
}) {
  const tokens = config.tokens;
  const eventDetails = (data.eventDetails || {}) as {
    date?: string;
    mapUrl?: string;
    address?: string;
    venue?: string;
  };
  const groom = (data.groom || {}) as {
    shortName?: string;
    name?: string;
  };
  const bride = (data.bride || {}) as {
    shortName?: string;
    name?: string;
  };
  const eventDate = eventDetails.date
    ? new Date(String(eventDetails.date)).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const primary =
    data?.displayOrder === "bride_first"
      ? bride.shortName || bride.name
      : groom.shortName || groom.name;
  const secondary =
    data?.displayOrder === "bride_first"
      ? groom.shortName || groom.name
      : bride.shortName || bride.name;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          config.assets?.welcomeBackground ||
          `radial-gradient(ellipse at center, ${tokens.colors.envelope} 0%, ${tokens.colors.textPrimary} 100%)`,
        fontFamily: tokens.fonts.heading,
      }}
    >
      <div
        className="relative w-[90%] max-w-md overflow-hidden rounded-2xl px-6 pb-10 pt-12 text-center shadow-2xl"
        style={{ background: tokens.colors.background, color: tokens.colors.textPrimary }}
      >
        {config.assets?.envelopeFront && (
          <img
            src={config.assets.envelopeFront}
            alt=""
            className="pointer-events-none absolute -right-4 -top-4 w-40 opacity-40"
          />
        )}
        <WelcomeIcon style={{ width: 80, height: 80, margin: "0 auto 16px" }} />
        {primary && secondary ? (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <span style={{ fontFamily: tokens.fonts.script, fontSize: "2rem" }}>{primary}</span>
            <span style={{ color: tokens.colors.accent }}>&amp;</span>
            <span style={{ fontFamily: tokens.fonts.script, fontSize: "2rem" }}>{secondary}</span>
          </div>
        ) : (
          <h1
            className="mb-4 text-3xl"
            style={{ fontFamily: tokens.fonts.script, color: tokens.colors.accent }}
          >
            {String(data?.title || config.name)}
          </h1>
        )}
        {eventDate && (
          <p className="mb-3 text-sm" style={{ color: tokens.colors.textSecondary }}>
            {eventDate}
          </p>
        )}
        <p className="mb-2 text-xs font-semibold tracking-widest" style={{ color: tokens.colors.accent }}>
          {String(data?.salutation || "Kính mời")}
        </p>
        {data?.guestName ? (
          <div
            className="mx-auto mb-3 inline-block rounded-full px-5 py-2 text-sm font-semibold"
            style={{
              background: `${tokens.colors.accent}15`,
              border: `1px solid ${tokens.colors.accent}33`,
            }}
          >
            {String(data.guestName)}
          </div>
        ) : null}
        <p className="mb-6 text-xs opacity-80">
          {String(data?.welcomeLine || "đến dự buổi tiệc chung vui cùng gia đình")}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-full px-10 py-3 text-sm font-semibold transition hover:scale-105"
          style={{
            background: tokens.colors.buttonBg,
            color: tokens.colors.buttonText,
          }}
        >
          Mở thiệp
        </button>
      </div>
    </div>
  );
}

export function MusicToggle({
  config,
  isPlaying,
  onToggle,
  visible,
}: {
  config: PresetThemeConfig;
  isPlaying: boolean;
  onToggle: () => void;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-xl transition hover:scale-110"
      style={{
        backgroundColor: config.tokens.colors.envelope,
        borderColor: config.tokens.colors.accent,
        color: "#fff",
      }}
    >
      <Music size={20} className={isPlaying ? "animate-spin" : ""} style={{ animationDuration: "3s" }} />
    </button>
  );
}
