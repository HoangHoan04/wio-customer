import type { ThemeModule } from "../_core/types";
import { themeConfig } from "./config";
import { useBohoFloralPinkTheme } from "./hook";
import Render from "./render";

export { themeConfig } from "./config";
export { useBohoFloralPinkTheme } from "./hook";
export { default as Render } from "./render";

export const themeModule: ThemeModule = {
  code: themeConfig.code,
  slug: themeConfig.slug,
  config: themeConfig,
  useTheme: useBohoFloralPinkTheme,
  Render,
};
