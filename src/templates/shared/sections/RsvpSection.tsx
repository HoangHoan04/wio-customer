"use client";

import { submitRsvpAction } from "@/services/rsvp-helper";
import { useState } from "react";
import type { SectionRenderProps } from "../types/preset-theme.types";

export function RsvpSection({ data, config }: SectionRenderProps) {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!data.showRsvp) return null;
  const tokens = config.tokens;

  return (
    <section className="px-4 py-8">
      <div
        className="mx-auto max-w-md rounded-3xl border p-6 shadow-lg backdrop-blur"
        style={{ background: `${tokens.colors.background}ee`, borderColor: `${tokens.colors.accent}33` }}
      >
        <h3 className="mb-2 text-center text-xl font-bold">{String(data.rsvpCta || "Xác nhận tham dự")}</h3>
        <p className="mb-5 text-center text-xs text-gray-500">{String(data.rsvpIntro || "")}</p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!attending) return;
            setIsSubmitting(true);
            submitRsvpAction(attending, guestCount)
              .then(() => alert("Cảm ơn bạn đã phản hồi!"))
              .catch((err) => alert(err?.message || "Gửi phản hồi thất bại"))
              .finally(() => setIsSubmitting(false));
          }}
        >
          <input
            required
            type="text"
            defaultValue={String(data.guestName || "")}
            disabled={!!data.guestName}
            placeholder="Tên của bạn"
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAttending(value)}
                className="flex-1 rounded-xl border py-3 text-sm font-semibold"
                style={{
                  background: attending === value ? tokens.colors.buttonBg : "transparent",
                  color: attending === value ? tokens.colors.buttonText : tokens.colors.textPrimary,
                  borderColor: `${tokens.colors.accent}44`,
                }}
              >
                {value === "yes" ? "Tôi sẽ đến" : "Tôi bận rồi"}
              </button>
            ))}
          </div>
          {attending === "yes" && (
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={() => setGuestCount((n) => Math.max(1, n - 1))} className="h-8 w-8 rounded-full border">-</button>
              <span>{guestCount} người</span>
              <button type="button" onClick={() => setGuestCount((n) => Math.min(10, n + 1))} className="h-8 w-8 rounded-full border">+</button>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full py-3 text-sm font-semibold"
            style={{ background: tokens.colors.buttonBg, color: tokens.colors.buttonText }}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi xác nhận"}
          </button>
        </form>
      </div>
    </section>
  );
}
