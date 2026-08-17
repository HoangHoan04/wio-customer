import dividerGreen from "@/assets/decorations/boho-floral-green/decoration_bar.webp";
import flowerTopGreen from "@/assets/decorations/boho-floral-green/flower_top.webp";
import { BOHO_FONTS, buildThemeConfig, weddingLayout } from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("BOHO_FLORAL_GREEN", {
  cardTypes: ["WEDDING"],
  googleFontsUrl: BOHO_FONTS,
  pageBackground: "linear-gradient(135deg, #f8fbf8 0%, #eef5ee 50%, #e3ede3 100%)",
  assets: { divider: dividerGreen.src, envelopeFront: flowerTopGreen.src },
  tokens: {
    code: "BOHO_FLORAL_GREEN",
    colors: {
      background: "#f8fbf8",
      textPrimary: "#2f4a32",
      textSecondary: "#4a674d",
      accent: "#5a8a5e",
      envelope: "#3d6641",
      buttonBg: "#3d6641",
      buttonText: "#f8fbf8",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: weddingLayout("split"),
});
