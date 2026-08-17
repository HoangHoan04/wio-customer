import type { ThemeModule } from "../_core/types";
import { themeConfig } from "./config";
import { useGraduationAcademicTheme } from "./hook";
import Render from "./render";

export { themeConfig } from "./config";
export { useGraduationAcademicTheme } from "./hook";
export { default as Render } from "./render";

export const themeModule: ThemeModule = {
  code: themeConfig.code,
  slug: themeConfig.slug,
  aliases: ["GRAD_NAVY", "graduation-academic"],
  config: themeConfig,
  useTheme: useGraduationAcademicTheme,
  Render,
};
