import type { ThemeModule } from "../_core/types";
import { themeConfig } from "./config";
import { useRoyalRedTheme } from "./hook";
import Render from "./render";

export { themeConfig } from "./config";
export { useRoyalRedTheme } from "./hook";
export { default as Render } from "./render";

export const themeModule: ThemeModule = {
  code: themeConfig.code,
  slug: themeConfig.slug,
  config: themeConfig,
  useTheme: useRoyalRedTheme,
  Render,
};
