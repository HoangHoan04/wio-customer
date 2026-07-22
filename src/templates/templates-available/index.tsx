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

const themeList = [
  { component: BohoFloralBrown, ...enumData.THEME_CODE.BOHO_FLORAL_BROWN },
  { component: BohoFloralGreen, ...enumData.THEME_CODE.BOHO_FLORAL_GREEN },
  { component: BohoFloralPink, ...enumData.THEME_CODE.BOHO_FLORAL_PINK },
  { component: DragonPhoenixRed, ...enumData.THEME_CODE.DRAGON_PHOENIX_RED },
  {
    component: RedDoubleHappiness,
    ...enumData.THEME_CODE.RED_DOUBLE_HAPPINESS,
  },
  { component: RoyalRed, ...enumData.THEME_CODE.ROYAL_RED },
];

export const ThemeRegistry: Record<string, React.ComponentType<any>> = {};
themeList.forEach(({ component, code, slug }) => {
  ThemeRegistry[code] = component;
  if (slug) ThemeRegistry[slug] = component;
});
ThemeRegistry.default = DefaultComponent;

export function resolveThemeKey(key: string): string {
  const normalizedKey = (key || "").trim().toLowerCase().replace(/[-_]/g, "");
  const found = themeList.find((t) => {
    const normCode = t.code.toLowerCase().replace(/[-_]/g, "");
    const normSlug = (t.slug || "").toLowerCase().replace(/[-_]/g, "");
    return normCode === normalizedKey || normSlug === normalizedKey;
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
    const normCode = t.code.toLowerCase().replace(/[-_]/g, "");
    const normSlug = (t.slug || "").toLowerCase().replace(/[-_]/g, "");
    return normCode === normalizedKey || normSlug === normalizedKey;
  });
  const Component = found?.component || ThemeRegistry.default;
  return (props: any) => (
    <Suspense fallback={<ThemeFallback />}>
      <Component {...props} />
    </Suspense>
  );
};
