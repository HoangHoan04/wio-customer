export type FontCategory = "sans" | "serif" | "script" | "display" | "mono";

export interface EditorFont {
  name: string;
  category: FontCategory;
  source: "system" | "google";
}

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  sans: "Không chân (Sans)",
  serif: "Có chân (Serif)",
  script: "Thư pháp / Viết tay",
  display: "Trang trí",
  mono: "Đơn cách (Mono)",
};

export const FONT_CATALOG: EditorFont[] = [
  { name: "Arial", category: "sans", source: "system" },
  { name: "Arial Black", category: "sans", source: "system" },
  { name: "Arial Narrow", category: "sans", source: "system" },
  { name: "Bahnschrift", category: "sans", source: "system" },
  { name: "Calibri", category: "sans", source: "system" },
  { name: "Calibri Light", category: "sans", source: "system" },
  { name: "Candara", category: "sans", source: "system" },
  { name: "Century Gothic", category: "sans", source: "system" },
  { name: "Corbel", category: "sans", source: "system" },
  { name: "Franklin Gothic Medium", category: "sans", source: "system" },
  { name: "Gadugi", category: "sans", source: "system" },
  { name: "Helvetica", category: "sans", source: "system" },
  { name: "Leelawadee UI", category: "sans", source: "system" },
  { name: "Lucida Sans Unicode", category: "sans", source: "system" },
  { name: "Malgun Gothic", category: "sans", source: "system" },
  { name: "Microsoft Sans Serif", category: "sans", source: "system" },
  { name: "Microsoft YaHei", category: "sans", source: "system" },
  { name: "Segoe UI", category: "sans", source: "system" },
  { name: "Tahoma", category: "sans", source: "system" },
  { name: "Trebuchet MS", category: "sans", source: "system" },
  { name: "Verdana", category: "sans", source: "system" },
  { name: "Yu Gothic", category: "sans", source: "system" },
  { name: "Be Vietnam Pro", category: "sans", source: "google" },
  { name: "DM Sans", category: "sans", source: "google" },
  { name: "Figtree", category: "sans", source: "google" },
  { name: "Inter", category: "sans", source: "google" },
  { name: "Josefin Sans", category: "sans", source: "google" },
  { name: "Lato", category: "sans", source: "google" },
  { name: "Manrope", category: "sans", source: "google" },
  { name: "Montserrat", category: "sans", source: "google" },
  { name: "Nunito", category: "sans", source: "google" },
  { name: "Open Sans", category: "sans", source: "google" },
  { name: "Oswald", category: "sans", source: "google" },
  { name: "Outfit", category: "sans", source: "google" },
  { name: "Plus Jakarta Sans", category: "sans", source: "google" },
  { name: "Poppins", category: "sans", source: "google" },
  { name: "Quicksand", category: "sans", source: "google" },
  { name: "Raleway", category: "sans", source: "google" },
  { name: "Roboto", category: "sans", source: "google" },
  { name: "Source Sans 3", category: "sans", source: "google" },
  { name: "Work Sans", category: "sans", source: "google" },
  { name: "Baskerville", category: "serif", source: "system" },
  { name: "Book Antiqua", category: "serif", source: "system" },
  { name: "Bookman Old Style", category: "serif", source: "system" },
  { name: "Cambria", category: "serif", source: "system" },
  { name: "Century", category: "serif", source: "system" },
  { name: "Century Schoolbook", category: "serif", source: "system" },
  { name: "Constantia", category: "serif", source: "system" },
  { name: "Garamond", category: "serif", source: "system" },
  { name: "Georgia", category: "serif", source: "system" },
  { name: "Palatino Linotype", category: "serif", source: "system" },
  { name: "Sitka Text", category: "serif", source: "system" },
  { name: "Times New Roman", category: "serif", source: "system" },
  { name: "Cardo", category: "serif", source: "google" },
  { name: "Cinzel", category: "serif", source: "google" },
  { name: "Cormorant Garamond", category: "serif", source: "google" },
  { name: "Crimson Text", category: "serif", source: "google" },
  { name: "DM Serif Display", category: "serif", source: "google" },
  { name: "EB Garamond", category: "serif", source: "google" },
  { name: "Fraunces", category: "serif", source: "google" },
  { name: "Instrument Serif", category: "serif", source: "google" },
  { name: "Libre Baskerville", category: "serif", source: "google" },
  { name: "Libre Caslon Text", category: "serif", source: "google" },
  { name: "Lora", category: "serif", source: "google" },
  { name: "Merriweather", category: "serif", source: "google" },
  { name: "Noto Serif", category: "serif", source: "google" },
  { name: "Playfair Display", category: "serif", source: "google" },
  { name: "Source Serif 4", category: "serif", source: "google" },
  { name: "Spectral", category: "serif", source: "google" },
  { name: "Brush Script MT", category: "script", source: "system" },
  { name: "Gabriola", category: "script", source: "system" },
  { name: "Ink Free", category: "script", source: "system" },
  { name: "Lucida Handwriting", category: "script", source: "system" },
  { name: "Segoe Print", category: "script", source: "system" },
  { name: "Segoe Script", category: "script", source: "system" },
  { name: "Alex Brush", category: "script", source: "google" },
  { name: "Allura", category: "script", source: "google" },
  { name: "Caveat", category: "script", source: "google" },
  { name: "Cookie", category: "script", source: "google" },
  { name: "Courgette", category: "script", source: "google" },
  { name: "Dancing Script", category: "script", source: "google" },
  { name: "Great Vibes", category: "script", source: "google" },
  { name: "Italianno", category: "script", source: "google" },
  { name: "Mr De Haviland", category: "script", source: "google" },
  { name: "Pacifico", category: "script", source: "google" },
  { name: "Parisienne", category: "script", source: "google" },
  { name: "Pinyon Script", category: "script", source: "google" },
  { name: "Sacramento", category: "script", source: "google" },
  { name: "Satisfy", category: "script", source: "google" },
  { name: "Tangerine", category: "script", source: "google" },
  { name: "Comic Sans MS", category: "display", source: "system" },
  { name: "Impact", category: "display", source: "system" },
  { name: "Abril Fatface", category: "display", source: "google" },
  { name: "Amatic SC", category: "display", source: "google" },
  { name: "Cinzel Decorative", category: "display", source: "google" },
  { name: "Comfortaa", category: "display", source: "google" },
  { name: "Playfair Display SC", category: "display", source: "google" },
  { name: "Poiret One", category: "display", source: "google" },
  { name: "Consolas", category: "mono", source: "system" },
  { name: "Courier New", category: "mono", source: "system" },
  { name: "Lucida Console", category: "mono", source: "system" },
  { name: "IBM Plex Mono", category: "mono", source: "google" },
  { name: "JetBrains Mono", category: "mono", source: "google" },
  { name: "Source Code Pro", category: "mono", source: "google" },
];

export const FONTS = FONT_CATALOG.map((font) => font.name);

export const FONT_SELECT_OPTIONS = FONT_CATALOG.map((font) => ({
  label: font.name,
  value: font.name,
  group: FONT_CATEGORY_LABELS[font.category],
  labelStyle: { fontFamily: `"${font.name}", sans-serif`, fontSize: 16 },
}));

function googleFamilyParam(name: string) {
  return `family=${encodeURIComponent(name).replace(/%20/g, "+")}:ital,wght@0,400;0,700;1,400`;
}

export function googleFontStylesheetUrls() {
  const names = FONT_CATALOG.filter((font) => font.source === "google").map(
    (font) => font.name,
  );
  const chunkSize = 10;
  const urls: string[] = [];
  for (let i = 0; i < names.length; i += chunkSize) {
    const chunk = names.slice(i, i + chunkSize);
    urls.push(
      `https://fonts.googleapis.com/css2?${chunk.map(googleFamilyParam).join("&")}&display=swap`,
    );
  }
  return urls;
}
