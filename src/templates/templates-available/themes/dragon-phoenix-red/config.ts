import { BOHO_FONTS, buildThemeConfig, weddingLayout } from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("DRAGON_PHOENIX_RED", {
  cardTypes: ["WEDDING"],
  googleFontsUrl: BOHO_FONTS,
  pageBackground: "linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%)",
  tokens: {
    code: "DRAGON_PHOENIX_RED",
    colors: {
      background: "#fff5f5",
      textPrimary: "#7f1d1d",
      textSecondary: "#991b1b",
      accent: "#dc2626",
      envelope: "#991b1b",
      buttonBg: "#b91c1c",
      buttonText: "#fff5f5",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: weddingLayout("single"),
});
