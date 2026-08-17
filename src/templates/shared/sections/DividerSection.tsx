"use client";

import type { SectionRenderProps } from "../types/preset-theme.types";

export function DividerSection({ config }: SectionRenderProps) {
  if (!config.assets?.divider) {
    return (
      <div className="my-6 flex justify-center">
        <div className="h-px w-32" style={{ background: config.tokens.colors.accent, opacity: 0.4 }} />
      </div>
    );
  }
  return (
    <div className="my-8 flex justify-center px-4">
      <img src={config.assets.divider} alt="" className="max-w-md opacity-80" />
    </div>
  );
}
