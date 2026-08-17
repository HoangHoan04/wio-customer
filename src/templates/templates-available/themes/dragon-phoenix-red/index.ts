import type { ThemeModule } from "../_core/types";
import { themeConfig } from "./config";
import { useDragonPhoenixRedTheme } from "./hook";
import Render from "./render";

export { themeConfig } from "./config";
export { useDragonPhoenixRedTheme } from "./hook";
export { default as Render } from "./render";

export const themeModule: ThemeModule = {
  code: themeConfig.code,
  slug: themeConfig.slug,
  config: themeConfig,
  useTheme: useDragonPhoenixRedTheme,
  Render,
};
