import { BOHO_FONTS, buildThemeConfig, weddingLayout } from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("RED_DOUBLE_HAPPINESS", {
  cardTypes: ["WEDDING"],
  googleFontsUrl: BOHO_FONTS,
  pageBackground: "linear-gradient(135deg, #fff1f1 0%, #ffd9d9 100%)",
  tokens: {
    code: "RED_DOUBLE_HAPPINESS",
    colors: {
      background: "#fff1f1",
      textPrimary: "#8b0000",
      textSecondary: "#a30000",
      accent: "#c41e3a",
      envelope: "#8b0000",
      buttonBg: "#8b0000",
      buttonText: "#fff1f1",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: weddingLayout("single"),
});
