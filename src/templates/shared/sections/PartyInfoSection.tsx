"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function PartyInfoSection({ data, config, variant }: SectionRenderProps) {
  const tokens = config.tokens;
  const events = (data.events as Array<{ title?: string; date?: string; time?: string; address?: string }>) || [];
  const eventDetails = data.eventDetails as { date?: string; time?: string; address?: string; venue?: string } | undefined;

  if (variant === "countdown" && data.showCountdown !== false && eventDetails?.date) {
    const target = new Date(String(eventDetails.date)).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return (
      <section className="px-6 py-8 text-center">
        <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: tokens.fonts.heading }}>
          Còn {days} ngày nữa
        </h3>
      </section>
    );
  }

  const items = events.length
    ? events
    : eventDetails
      ? [{ title: "Sự kiện", date: eventDetails.date, time: eventDetails.time, address: eventDetails.address || eventDetails.venue }]
      : [];

  if (!items.length) return null;

  return (
    <section className="space-y-4 px-6 py-8">
      {items.map((event, idx) => (
        <div
          key={idx}
          className="mx-auto max-w-md rounded-2xl border p-5 text-center"
          style={{ borderColor: `${tokens.colors.accent}33`, background: `${tokens.colors.background}cc` }}
        >
          <h3 className="text-lg font-semibold" style={{ fontFamily: tokens.fonts.heading }}>
            {event.title}
          </h3>
          {(event.date || event.time) && (
            <p className="mt-2 text-sm" style={{ color: tokens.colors.textSecondary }}>
              {[event.date, event.time].filter(Boolean).join(" · ")}
            </p>
          )}
          {event.address && (
            <p className="mt-2 text-sm" style={{ color: tokens.colors.textPrimary }}>
              {event.address}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
