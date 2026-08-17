import {
  DEFAULT_SECTION_ORDER,
  SECTION_FLAG_MAP,
  defaultSectionOrderForCardType,
} from "../constants/sections";
import type {
  ExtendedSectionConfig,
  PresetThemeRenderData,
  SectionConfigEntry,
  SectionId,
  ThemeLayoutConfig,
} from "../types/preset-theme.types";

function normalizeEntry(
  value: boolean | SectionConfigEntry | undefined,
): SectionConfigEntry {
  if (typeof value === "boolean") return { enabled: value };
  if (value && typeof value === "object") {
    return {
      enabled: value.enabled !== false,
      order: value.order,
      variant: value.variant,
    };
  }
  return { enabled: true };
}

export function isSectionEnabled(
  sectionId: SectionId,
  data: PresetThemeRenderData,
): boolean {
  const flag = SECTION_FLAG_MAP[sectionId];
  const sectionConfig = data.sectionConfig || {};

  if (flag && flag in sectionConfig) {
    return normalizeEntry(sectionConfig[flag]).enabled;
  }

  switch (sectionId) {
    case "hero":
      return data.showHeroImage !== false;
    case "gallery":
      return data.showGallery !== false;
    case "rsvp":
      return data.showRsvp !== false;
    case "guestbook":
      return data.showGuestbook !== false;
    case "dressCode":
      return data.showDressCode === true;
    case "timeline":
      return data.showTimeline === true;
    case "thankYou":
      return data.showThankYou !== false;
    case "divider":
    case "familyInfo":
    case "hosts":
    case "ceremonies":
    case "partyInfo":
      return true;
    case "countdown":
      return data.showCountdown !== false;
    case "map":
      return data.showMap !== false;
    case "giftBox":
      return data.showGifts !== false;
    default:
      return true;
  }
}

export function resolveSectionOrder(
  data: PresetThemeRenderData,
  themeLayout?: ThemeLayoutConfig,
): SectionId[] {
  const baseOrder =
    themeLayout?.sectionOrder ||
    data.themeLayout?.sectionOrder ||
    defaultSectionOrderForCardType(data.cardType as string);

  const sectionConfig = data.sectionConfig || {};
  const withCustomOrder = [...baseOrder].sort((a, b) => {
    const flagA = SECTION_FLAG_MAP[a];
    const flagB = SECTION_FLAG_MAP[b];
    const orderA =
      (flagA ? normalizeEntry(sectionConfig[flagA]).order : undefined) ??
      baseOrder.indexOf(a);
    const orderB =
      (flagB ? normalizeEntry(sectionConfig[flagB]).order : undefined) ??
      baseOrder.indexOf(b);
    return orderA - orderB;
  });

  const seen = new Set<SectionId>();
  const ordered: SectionId[] = [];
  for (const id of withCustomOrder) {
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
  }

  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) ordered.push(id);
  }

  return ordered.filter((id) => isSectionEnabled(id, data));
}

export function resolveSectionVariant(
  sectionId: SectionId,
  data: PresetThemeRenderData,
  themeLayout?: ThemeLayoutConfig,
): string | undefined {
  const flag = SECTION_FLAG_MAP[sectionId];
  const fromConfig =
    flag && data.sectionConfig?.[flag]
      ? normalizeEntry(data.sectionConfig[flag]).variant
      : undefined;
  return (
    fromConfig ||
    themeLayout?.sectionVariants?.[sectionId] ||
    data.themeLayout?.sectionVariants?.[sectionId]
  );
}
