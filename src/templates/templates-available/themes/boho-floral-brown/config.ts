import dividerBrown from "@/assets/decorations/boho-floral-brown/decoration_bar.webp";
import flowerTopBrown from "@/assets/decorations/boho-floral-brown/flower_top.webp";
import { BOHO_FONTS, buildThemeConfig, weddingLayout } from "../_core/config-helpers";

export const themeConfig = buildThemeConfig("BOHO_FLORAL_BROWN", {
  cardTypes: ["WEDDING"],
  googleFontsUrl: BOHO_FONTS,
  pageBackground: "linear-gradient(135deg, #fdfcf9 0%, #f7f3eb 50%, #f1e9dc 100%)",
  assets: { divider: dividerBrown.src, envelopeFront: flowerTopBrown.src },
  tokens: {
    code: "BOHO_FLORAL_BROWN",
    colors: {
      background: "#fdfcf9",
      textPrimary: "#4e3629",
      textSecondary: "#705446",
      accent: "#b35a38",
      envelope: "#8b5e3c",
      buttonBg: "#8b5e3c",
      buttonText: "#fdfcf9",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  layout: weddingLayout("split"),
});
