import { enumData } from "@/common/enum";
import type { PresetThemeConfig, ThemeLayoutConfig } from "../../../shared/types/preset-theme.types";
import {
  BIRTHDAY_SECTION_ORDER,
  DEFAULT_SECTION_ORDER,
  GRADUATION_SECTION_ORDER,
} from "../../../shared/constants/sections";

export const BOHO_FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Playfair+Display:wght@400;600&family=Great+Vibes&display=swap";

export const MODERN_FONTS =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&family=Montserrat:wght@400;600&family=Great+Vibes&display=swap";

export function weddingLayout(heroStyle: "single" | "split" = "split"): ThemeLayoutConfig {
  return {
    envelopeStyle: "classic",
    heroStyle,
    sectionOrder: DEFAULT_SECTION_ORDER,
  };
}

export function buildThemeConfig(
  themeKey: keyof typeof enumData.THEME_CODE,
  overrides: Partial<PresetThemeConfig>,
): PresetThemeConfig {
  const meta = enumData.THEME_CODE[themeKey];
  return {
    code: meta.code,
    name: meta.name,
    slug: meta.slug,
    cardTypes: overrides.cardTypes || ["WEDDING"],
    tokens: overrides.tokens!,
    assets: overrides.assets,
    layout: overrides.layout || weddingLayout(),
    googleFontsUrl: overrides.googleFontsUrl,
    pageBackground: overrides.pageBackground,
  };
}

export { BIRTHDAY_SECTION_ORDER, GRADUATION_SECTION_ORDER, DEFAULT_SECTION_ORDER };
