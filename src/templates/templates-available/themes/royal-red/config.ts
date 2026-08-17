import { BOHO_FONTS, buildThemeConfig, weddingLayout } from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("ROYAL_RED", {
  cardTypes: ["WEDDING"],
  googleFontsUrl: BOHO_FONTS,
  pageBackground: "linear-gradient(135deg, #1a0505 0%, #3d0a0a 50%, #1a0505 100%)",
  tokens: {
    code: "ROYAL_RED",
    colors: {
      background: "#2a0808",
      textPrimary: "#fde8d0",
      textSecondary: "#f0c896",
      accent: "#d4af37",
      envelope: "#5c1010",
      buttonBg: "#8b1a1a",
      buttonText: "#fde8d0",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: weddingLayout("split"),
});
