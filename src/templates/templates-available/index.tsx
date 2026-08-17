"use client";

import { enumData } from "@/common/enum";
import React, { Suspense } from "react";
import {
  getThemeConfig,
  getThemeModule,
  listThemeConfigs,
} from "./themes/registry";
import type { PresetThemeConfig } from "../shared/types/preset-theme.types";
import type { ThemeModule } from "./themes/registry";

const DefaultComponent: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9] p-[50px] text-center text-[#333]">
    <h1>Bản xem trước của Theme này đang được phát triển</h1>
  </div>
);

interface ThemeItem {
  component: React.ComponentType<any>;
  code: string;
  name: string;
  slug?: string;
  aliases?: string[];
  config?: PresetThemeConfig | null;
  module?: ThemeModule | null;
}

function buildThemeComponent(module: ThemeModule): React.ComponentType<any> {
  const Render = module.Render;
  return function ThemeEntry(props: any) {
    return <Render {...props} />;
  };
}

const themeList: ThemeItem[] = Object.values(enumData.THEME_CODE)
  .filter((meta) => meta.code !== "CUSTOM_DESIGN")
  .map((meta) => {
    const module = getThemeModule(meta.code);
    return {
      component: module ? buildThemeComponent(module) : DefaultComponent,
      code: meta.code,
      name: meta.name,
      slug: meta.slug,
      config: module?.config ?? null,
      module,
      aliases:
        meta.code === "GRADUATION_ACADEMIC"
          ? ["GRAD_NAVY", "graduation-academic"]
          : meta.code === "GRAD_NAVY"
            ? ["GRADUATION_ACADEMIC"]
            : module?.aliases,
    };
  });

export const ThemeRegistry: Record<string, React.ComponentType<any>> = {};
themeList.forEach(({ component, code, slug, aliases }) => {
  ThemeRegistry[code] = component;
  if (slug) ThemeRegistry[slug] = component;
  if (aliases) {
    aliases.forEach((alias) => {
      ThemeRegistry[alias] = component;
    });
  }
});
ThemeRegistry.default = DefaultComponent;

export function resolveThemeKey(key: string): string {
  const normalizedKey = (key || "").trim().toLowerCase().replace(/[-_]/g, "");
  const found = themeList.find((t) => {
    const normCode = (t.code || "").toLowerCase().replace(/[-_]/g, "");
    const normSlug = (t.slug || "").toLowerCase().replace(/[-_]/g, "");
    const aliasMatch = (t.aliases || []).some(
      (a) => a.toLowerCase().replace(/[-_]/g, "") === normalizedKey,
    );
    return (
      normCode === normalizedKey ||
      normSlug === normalizedKey ||
      aliasMatch ||
      normalizedKey.includes(normCode) ||
      normCode.includes(normalizedKey)
    );
  });
  if (found) return found.code;
  return key;
}

export function getThemeConfigByCode(themeCode: string) {
  return getThemeConfig(resolveThemeKey(themeCode));
}

export { getThemeConfig, listThemeConfigs, getThemeModule };

const ThemeFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] font-sans text-[#666]">
    <p>Đang tải giao diện...</p>
  </div>
);

export const getThemeComponent = (slugOrCode: string): React.FC<any> => {
  const normalizedKey = (slugOrCode || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]/g, "");
  const found = themeList.find((t) => {
    const normCode = (t.code || "").toLowerCase().replace(/[-_]/g, "");
    const normSlug = (t.slug || "").toLowerCase().replace(/[-_]/g, "");
    const aliasMatch = (t.aliases || []).some(
      (a) => a.toLowerCase().replace(/[-_]/g, "") === normalizedKey,
    );
    return (
      normCode === normalizedKey ||
      normSlug === normalizedKey ||
      aliasMatch ||
      (normalizedKey.length > 3 && normCode.includes(normalizedKey)) ||
      (normalizedKey.length > 3 && normSlug.includes(normalizedKey))
    );
  });
  const Component = found?.component || ThemeRegistry.default;
  return (props: any) => (
    <Suspense fallback={<ThemeFallback />}>
      <Component {...props} />
    </Suspense>
  );
};
