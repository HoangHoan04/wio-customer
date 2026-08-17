import {
  BIRTHDAY_SECTION_ORDER,
  MODERN_FONTS,
  buildThemeConfig,
} from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("BABY_BLUSH", {
  cardTypes: ["BABY"],
  googleFontsUrl: MODERN_FONTS,
  pageBackground: "linear-gradient(145deg, #fff5f7 0%, #fce7f3 100%)",
  tokens: {
    code: "BABY_BLUSH",
    colors: {
      background: "#fff5f7",
      textPrimary: "#831843",
      textSecondary: "#9d174d",
      accent: "#ec4899",
      envelope: "#be185d",
      buttonBg: "#db2777",
      buttonText: "#ffffff",
    },
    fonts: {
      heading: "'Outfit', sans-serif",
      body: "'Montserrat', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: {
    envelopeStyle: "classic",
    heroStyle: "single",
    sectionOrder: BIRTHDAY_SECTION_ORDER,
  },
});
