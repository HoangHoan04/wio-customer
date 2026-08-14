"use client";

import { enumData } from "@/common/enum";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const BohoFloralBrown = dynamic(() => import("./BohoFloralBrown/index"));
const BohoFloralGreen = dynamic(() => import("./BohoFloralGreen/index"));
const BohoFloralPink = dynamic(() => import("./BohoFloralPink/index"));
const DragonPhoenixRed = dynamic(() => import("./DragonPhoenixRed/index"));
const RedDoubleHappiness = dynamic(() => import("./RedDoubleHappiness/index"));
const RoyalRed = dynamic(() => import("./RoyalRed/index"));
const BirthdayCoral = dynamic(() => import("./BirthdayCoral/index"));
const GraduationAcademic = dynamic(() => import("./GraduationAcademic/index"));
const CustomDesignTemplate = dynamic(() => import("./CustomDesignTemplate/index"));

const DefaultComponent: React.FC = () => (
  <div
    style={{
      padding: "50px",
      textAlign: "center",
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      color: "#333",
    }}
  >
    <h1>Bản xem trước của Theme này đang được phát triển</h1>
  </div>
);

interface ThemeItem {
  component: React.ComponentType<any>;
  code: string;
  name: string;
  slug?: string;
  aliases?: string[];
}

const themeList: ThemeItem[] = [
  { component: BohoFloralBrown, ...enumData.THEME_CODE.BOHO_FLORAL_BROWN },
  { component: BohoFloralGreen, ...enumData.THEME_CODE.BOHO_FLORAL_GREEN },
  { component: BohoFloralPink, ...enumData.THEME_CODE.BOHO_FLORAL_PINK },
  { component: DragonPhoenixRed, ...enumData.THEME_CODE.DRAGON_PHOENIX_RED },
  {
    component: RedDoubleHappiness,
    ...enumData.THEME_CODE.RED_DOUBLE_HAPPINESS,
  },
  { component: RoyalRed, ...enumData.THEME_CODE.ROYAL_RED },
  {
    component: BirthdayCoral,
    ...enumData.THEME_CODE.BIRTHDAY_CORAL,
    aliases: [
      "sinh-nhat-coral",
      "sinh-nhat-san-ho",
      "birthday-coral",
      "birthday_coral",
      "sinh-nhat",
      "birthday",
    ],
  },
  {
    component: GraduationAcademic,
    ...enumData.THEME_CODE.GRADUATION_ACADEMIC,
    aliases: [
      "tot-nghiep-navy",
      "tot-nghiep-academic",
      "grad-navy",
      "grad_navy",
      "graduation-academic",
      "graduation_academic",
      "tot-nghiep",
      "graduation",
    ],
  },
  { component: CustomDesignTemplate, ...enumData.THEME_CODE.CUSTOM_DESIGN },
];

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

const ThemeFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#fdfbf7",
      color: "#666",
      fontFamily: "sans-serif",
    }}
  >
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
