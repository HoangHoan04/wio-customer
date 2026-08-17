import dividerPink from "@/assets/decorations/boho-floral-pink/decoration_bar.webp";
import flowerTopPink from "@/assets/decorations/boho-floral-pink/flower_top.webp";
import { BOHO_FONTS, buildThemeConfig, weddingLayout } from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("BOHO_FLORAL_PINK", {
  cardTypes: ["WEDDING"],
  googleFontsUrl: BOHO_FONTS,
  pageBackground: "linear-gradient(135deg, #fff9fb 0%, #fceef2 50%, #f8dfe8 100%)",
  assets: { divider: dividerPink.src, envelopeFront: flowerTopPink.src },
  tokens: {
    code: "BOHO_FLORAL_PINK",
    colors: {
      background: "#fff9fb",
      textPrimary: "#6b3a4a",
      textSecondary: "#8f5668",
      accent: "#d66b8a",
      envelope: "#b84d6d",
      buttonBg: "#b84d6d",
      buttonText: "#fff9fb",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: weddingLayout("split"),
});
