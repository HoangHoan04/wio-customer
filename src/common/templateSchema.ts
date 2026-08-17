import { getThemeConfigByCode } from "@/templates/templates-available";
import type { HeroStyle } from "@/templates/shared/types/preset-theme.types";

export interface TemplateSchema {
  heroStyle: HeroStyle;
}

const defaultSchema: TemplateSchema = { heroStyle: "single" };

export function getTemplateSchema(themeCode: string): TemplateSchema {
  const config = getThemeConfigByCode(themeCode);
  return { heroStyle: config?.layout.heroStyle || defaultSchema.heroStyle };
}

export type { HeroStyle };
