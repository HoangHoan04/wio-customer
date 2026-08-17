import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export type SectionId =
  | "hero"
  | "divider"
  | "familyInfo"
  | "hosts"
  | "intro"
  | "ceremonies"
  | "countdown"
  | "gallery"
  | "partyInfo"
  | "timeline"
  | "rsvp"
  | "map"
  | "guestbook"
  | "giftBox"
  | "dressCode"
  | "thankYou";

export type EnvelopeStyle = "classic" | "minimal" | "none";
export type HeroStyle = "single" | "split" | "carousel";

export interface ThemeLayoutConfig {
  envelopeStyle: EnvelopeStyle;
  heroStyle: HeroStyle;
  sectionOrder: SectionId[];
  sectionVariants?: Partial<Record<SectionId, string>>;
}

export interface PresetThemeAssets {
  divider?: string;
  envelopeFront?: string;
  envelopeBack?: string;
  backgroundPattern?: string;
  welcomeBackground?: string;
}

export interface PresetThemeConfig {
  code: string;
  name: string;
  slug: string;
  cardTypes: string[];
  tokens: ThemeTemplateConfig;
  assets?: PresetThemeAssets;
  layout: ThemeLayoutConfig;
  googleFontsUrl?: string;
  pageBackground?: string;
}

export interface SectionConfigEntry {
  enabled: boolean;
  order?: number;
  variant?: string;
}

export type ExtendedSectionConfig = Record<
  string,
  boolean | SectionConfigEntry
>;

export interface PresetThemeRenderData {
  themeCode?: string;
  themeLayout?: ThemeLayoutConfig;
  presetTokens?: Partial<ThemeTemplateConfig>;
  sectionConfig?: ExtendedSectionConfig;
  [key: string]: unknown;
}

export interface SectionRenderProps {
  data: PresetThemeRenderData;
  config: PresetThemeConfig;
  variant?: string;
}
