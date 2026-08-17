import type { ThemeModule } from "../_core/types";
import { themeConfig } from "./config";
import { useRedDoubleHappinessTheme } from "./hook";
import Render from "./render";

export { themeConfig } from "./config";
export { useRedDoubleHappinessTheme } from "./hook";
export { default as Render } from "./render";

export const themeModule: ThemeModule = {
  code: themeConfig.code,
  slug: themeConfig.slug,
  config: themeConfig,
  useTheme: useRedDoubleHappinessTheme,
  Render,
};
