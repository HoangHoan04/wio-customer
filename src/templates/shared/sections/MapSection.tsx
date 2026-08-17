"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function MapSection({ data, config }: SectionRenderProps) {
  if (data.showMap === false) return null;
  const eventDetails = (data.eventDetails || {}) as {
    mapUrl?: string;
    address?: string;
    venue?: string;
  };
  const mapUrl = String(data.mapUrl || eventDetails.mapUrl || "");
  const address = String(eventDetails.address || eventDetails.venue || "");
  if (!mapUrl && !address) return null;
  return (
    <section className="px-4 py-8">
      <h3 className="mb-4 text-center text-xl font-semibold" style={{ fontFamily: config.tokens.fonts.heading }}>
        Địa điểm
      </h3>
      {address && <p className="mb-4 text-center text-sm">{address}</p>}
      {mapUrl && (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-lg">
          <iframe title="map" src={mapUrl} className="h-72 w-full border-0" loading="lazy" />
        </div>
      )}
    </section>
  );
}
