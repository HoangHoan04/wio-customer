import { resolveThemeKey } from "@/templates/templates-available";
import { enumData } from "./enum";

export type HeroStyle = "single" | "split" | "none";

export interface TemplateSchema {
  heroStyle: HeroStyle;
}

const defaultSchema: TemplateSchema = {
  heroStyle: "single",
};

const schemaByCode: Record<string, TemplateSchema> = {
  [enumData.THEME_CODE.BOHO_FLORAL_BROWN.code]: { heroStyle: "split" },
  [enumData.THEME_CODE.BOHO_FLORAL_GREEN.code]: { heroStyle: "split" },
  [enumData.THEME_CODE.BOHO_FLORAL_PINK.code]: { heroStyle: "split" },
  [enumData.THEME_CODE.ROYAL_RED.code]: { heroStyle: "split" },
  [enumData.THEME_CODE.DRAGON_PHOENIX_RED.code]: { heroStyle: "single" },
  [enumData.THEME_CODE.RED_DOUBLE_HAPPINESS.code]: { heroStyle: "single" },
};

export const TEMPLATE_SCHEMAS: Record<string, TemplateSchema> = {};

Object.values(enumData.THEME_CODE).forEach(({ code, slug }) => {
  if (schemaByCode[code]) {
    TEMPLATE_SCHEMAS[code] = schemaByCode[code];
    if (slug) TEMPLATE_SCHEMAS[slug] = schemaByCode[code];
  }
});

export const getTemplateSchema = (themeCode: string): TemplateSchema => {
  const key = resolveThemeKey(themeCode);
  return TEMPLATE_SCHEMAS[key] || defaultSchema;
};
