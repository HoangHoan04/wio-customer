"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function GallerySection({ data, config }: SectionRenderProps) {
  if (!data.showGallery) return null;
  const photos = ((data.photos || data.gallery) as string[]) || [];
  if (!photos.length) return null;
  return (
    <section className="px-4 py-8">
      <h3
        className="mb-6 text-center text-xl font-semibold"
        style={{ fontFamily: config.tokens.fonts.heading, color: config.tokens.colors.textPrimary }}
      >
        Album kỷ niệm
      </h3>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((url, idx) => (
          <img key={idx} src={url} alt="" className="aspect-square w-full rounded-xl object-cover shadow-md" />
        ))}
      </div>
    </section>
  );
}
