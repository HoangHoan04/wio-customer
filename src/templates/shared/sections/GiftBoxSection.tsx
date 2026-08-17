"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function GiftBoxSection({ data, config }: SectionRenderProps) {
  if (data.showGifts === false) return null;
  const groom = data.groom as { bankAccount?: Record<string, string> } | undefined;
  const bride = data.bride as { bankAccount?: Record<string, string> } | undefined;
  const accounts = [groom?.bankAccount, bride?.bankAccount].filter(
    (a) => a?.accountNumber || a?.qrUrl,
  );
  if (!accounts.length) return null;
  const tokens = config.tokens;
  return (
    <section className="px-4 py-8">
      <h3 className="mb-2 text-center text-xl font-semibold" style={{ fontFamily: tokens.fonts.heading }}>
        {String(data.giftsTitle || "Mừng cưới")}
      </h3>
      <p className="mb-6 text-center text-sm opacity-70">{String(data.giftsSubtitle || "")}</p>
      <div className="mx-auto grid max-w-2xl gap-4 md:grid-cols-2">
        {accounts.map((acc, idx) => (
          <div key={idx} className="rounded-2xl border p-5 text-center" style={{ borderColor: `${tokens.colors.accent}33` }}>
            {acc?.qrUrl && <img src={acc.qrUrl} alt="QR" className="mx-auto mb-3 h-36 w-36 object-contain" />}
            <p className="text-sm font-semibold">{acc?.bankName}</p>
            <p className="text-sm">{acc?.accountName}</p>
            <p className="text-sm tracking-wider">{acc?.accountNumber}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
