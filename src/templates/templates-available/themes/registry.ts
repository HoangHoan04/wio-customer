import type { PresetThemeConfig } from "../../shared/types/preset-theme.types";
import type { ThemeModule } from "./_core/types";
import { themeModule as babyBlush } from "./baby-blush";
import { themeModule as birthdayCoral } from "./birthday-coral";
import { themeModule as bohoFloralBrown } from "./boho-floral-brown";
import { themeModule as bohoFloralGreen } from "./boho-floral-green";
import { themeModule as bohoFloralPink } from "./boho-floral-pink";
import { themeModule as dragonPhoenixRed } from "./dragon-phoenix-red";
import { themeModule as graduationAcademic } from "./graduation-academic";
import { themeModule as redDoubleHappiness } from "./red-double-happiness";
import { themeModule as royalRed } from "./royal-red";

export const THEME_MODULES: ThemeModule[] = [
  bohoFloralBrown,
  bohoFloralGreen,
  bohoFloralPink,
  dragonPhoenixRed,
  redDoubleHappiness,
  royalRed,
  birthdayCoral,
  graduationAcademic,
  babyBlush,
];

const moduleByCode = new Map<string, ThemeModule>();
THEME_MODULES.forEach((module) => {
  moduleByCode.set(module.code, module);
  moduleByCode.set(module.slug, module);
  (module.aliases || []).forEach((alias) => moduleByCode.set(alias, module));
});

export function getThemeModule(themeCode: string): ThemeModule | null {
  const normalized = themeCode.trim().toUpperCase().replace(/[-_]/g, "");
  const direct = moduleByCode.get(themeCode);
  if (direct) return direct;

  return (
    THEME_MODULES.find((module) => {
      const code = module.code.toUpperCase().replace(/[-_]/g, "");
      const slug = module.slug.toLowerCase().replace(/[-_]/g, "");
      const key = themeCode.toLowerCase().replace(/[-_]/g, "");
      return (
        code === normalized ||
        slug === key ||
        code.includes(normalized) ||
        normalized.includes(code)
      );
    }) || null
  );
}

export function getThemeConfig(themeCode: string): PresetThemeConfig | null {
  return getThemeModule(themeCode)?.config ?? null;
}

export function listThemeConfigs(): PresetThemeConfig[] {
  const seen = new Set<string>();
  return THEME_MODULES.map((m) => m.config).filter((cfg) => {
    if (seen.has(cfg.code)) return false;
    seen.add(cfg.code);
    return cfg.code !== "GRAD_NAVY";
  });
}

export type { ThemeModule, ThemeRenderProps, ThemeRuntime } from "./_core/types";
