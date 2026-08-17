import {
  BIRTHDAY_SECTION_ORDER,
  MODERN_FONTS,
  buildThemeConfig,
} from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("BIRTHDAY_CORAL", {
  cardTypes: ["BIRTHDAY"],
  googleFontsUrl: MODERN_FONTS,
  pageBackground: "linear-gradient(145deg, #fff7ed 0%, #ffedd5 45%, #fed7aa 100%)",
  tokens: {
    code: "BIRTHDAY_CORAL",
    colors: {
      background: "#fff8f3",
      textPrimary: "#7c2d12",
      textSecondary: "#9a3412",
      accent: "#f97316",
      envelope: "#ea580c",
      buttonBg: "#ea580c",
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
