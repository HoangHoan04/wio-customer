"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function GuestbookSection({ data, config }: SectionRenderProps) {
  if (!data.showGuestbook) return null;
  const wishes = (data.wishes as Array<{ guestName?: string; content?: string }>) || [];
  return (
    <section className="px-4 py-8">
      <h3 className="mb-6 text-center text-xl font-semibold" style={{ fontFamily: config.tokens.fonts.heading }}>
        Sổ lời chúc
      </h3>
      <div className="mx-auto max-w-md space-y-3">
        {wishes.length ? (
          wishes.map((wish, idx) => (
            <div key={idx} className="rounded-2xl border p-4" style={{ borderColor: `${config.tokens.colors.accent}33` }}>
              <p className="text-sm font-semibold">{wish.guestName}</p>
              <p className="mt-1 text-sm opacity-80">{wish.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-sm opacity-60">Hãy là người đầu tiên gửi lời chúc!</p>
        )}
      </div>
    </section>
  );
}
