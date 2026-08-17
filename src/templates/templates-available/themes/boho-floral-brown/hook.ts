import { createThemeHook } from "../_core/create-hook";
import { themeConfig } from "./config";

/** Runtime state + side effects (fonts, audio, envelope). Extend here for theme-specific API calls. */
export const useBohoFloralBrownTheme = createThemeHook(themeConfig);
