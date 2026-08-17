import {
  GRADUATION_SECTION_ORDER,
  MODERN_FONTS,
  buildThemeConfig,
} from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("GRADUATION_ACADEMIC", {
  cardTypes: ["GRADUATION"],
  googleFontsUrl: MODERN_FONTS,
  pageBackground: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
  tokens: {
    code: "GRADUATION_ACADEMIC",
    colors: {
      background: "#f0f7ff",
      textPrimary: "#1e3a5f",
      textSecondary: "#334155",
      accent: "#1d4ed8",
      envelope: "#1e3a8a",
      buttonBg: "#1d4ed8",
      buttonText: "#ffffff",
    },
    fonts: {
      heading: "'Outfit', sans-serif",
      body: "'Montserrat', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: {
    envelopeStyle: "minimal",
    heroStyle: "single",
    sectionOrder: GRADUATION_SECTION_ORDER,
  },
});
