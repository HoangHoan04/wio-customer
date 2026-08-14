import type { EditorElement } from "../types";
import { createDefaultShape, createDefaultText } from "./constants";

export type PresetCategory = "text" | "combo" | "frame" | "badge";

export type PresetTemplateEl = Omit<EditorElement, "id" | "zIndex">;

export interface DesignPreset {
  id: string;
  title: string;
  category: PresetCategory;
  keywords: string;
  grouped: boolean;
  elements: PresetTemplateEl[];
}

const INK = "#2D231F";
const TAN = "#C4B09A";
const MUTED = "#7A6A5C";
const PAPER = "#F3EDE3";

function withoutMeta(el: EditorElement): PresetTemplateEl {
  const { id: _id, zIndex: _z, ...rest } = el;
  return rest;
}

function text(
  content: string,
  opts: {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
    letterSpacing?: number;
    textTransform?: EditorElement["textTransform"];
    color?: string;
    lineHeight?: number;
  },
): PresetTemplateEl {
  return withoutMeta(
    createDefaultText("p", {
      content,
      x: opts.x,
      y: opts.y,
      width: opts.width,
      height: opts.height,
      fontSize: opts.fontSize,
      fontFamily: opts.fontFamily ?? "Playfair Display",
      fontWeight: opts.fontWeight ?? "normal",
      fontStyle: opts.fontStyle ?? "normal",
      letterSpacing: opts.letterSpacing ?? 0,
      textTransform: opts.textTransform ?? "none",
      color: opts.color ?? INK,
      fill: opts.color ?? INK,
      textAlign: "center",
      lineHeight: opts.lineHeight ?? 1.2,
    }),
  );
}

function shape(
  shapeType: EditorElement["shapeType"],
  opts: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    rotation?: number;
  },
): PresetTemplateEl {
  const strokeWidth =
    opts.strokeWidth ?? (shapeType === "line" ? Math.max(1, opts.height) : 0);
  return withoutMeta({
    ...createDefaultShape("p", shapeType),
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.height,
    fill: opts.fill ?? INK,
    color: opts.fill ?? INK,
    stroke: opts.stroke ?? "transparent",
    strokeWidth,
    opacity: opts.opacity ?? 1,
    rotation: opts.rotation ?? 0,
  });
}

export const PRESET_CATEGORIES: {
  id: PresetCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "Tất cả" },
  { id: "text", label: "Chữ mẫu" },
  { id: "combo", label: "Cụm thiết kế" },
  { id: "frame", label: "Khung & họa tiết" },
  { id: "badge", label: "Nhãn" },
];

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: "grad-title",
    title: "Lễ tốt nghiệp",
    category: "text",
    keywords: "tot nghiep graduation le tot nghiep",
    grouped: false,
    elements: [
      text("LỄ TỐT NGHIỆP", {
        x: 0,
        y: 0,
        width: 360,
        height: 52,
        fontSize: 32,
        fontWeight: "bold",
        letterSpacing: 6,
        textTransform: "uppercase",
      }),
    ],
  },
  {
    id: "grad-class",
    title: "Class of 2026",
    category: "text",
    keywords: "class of tot nghiep graduation",
    grouped: false,
    elements: [
      text("Class of 2026", {
        x: 0,
        y: 0,
        width: 320,
        height: 56,
        fontSize: 42,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "congrats",
    title: "Chúc mừng",
    category: "text",
    keywords: "chuc mung congratulations",
    grouped: false,
    elements: [
      text("Chúc mừng", {
        x: 0,
        y: 0,
        width: 320,
        height: 56,
        fontSize: 44,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "happy-birthday",
    title: "Sinh nhật vui vẻ",
    category: "text",
    keywords: "sinh nhat birthday happy",
    grouped: false,
    elements: [
      text("Sinh nhật vui vẻ", {
        x: 0,
        y: 0,
        width: 360,
        height: 58,
        fontSize: 40,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "save-the-date",
    title: "Save the Date",
    category: "text",
    keywords: "save the date luu ngay",
    grouped: false,
    elements: [
      text("Save the Date", {
        x: 0,
        y: 0,
        width: 360,
        height: 58,
        fontSize: 40,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "you-are-invited",
    title: "Thân mời",
    category: "text",
    keywords: "than moi invited moi",
    grouped: false,
    elements: [
      text("Thân mời", {
        x: 0,
        y: 0,
        width: 320,
        height: 56,
        fontSize: 42,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "grand-opening",
    title: "Khai trương",
    category: "text",
    keywords: "khai truong grand opening",
    grouped: false,
    elements: [
      text("KHAI TRƯƠNG", {
        x: 0,
        y: 0,
        width: 360,
        height: 50,
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: 8,
        textTransform: "uppercase",
      }),
    ],
  },
  {
    id: "baby-shower",
    title: "Baby Shower",
    category: "text",
    keywords: "baby shower day con",
    grouped: false,
    elements: [
      text("Baby Shower", {
        x: 0,
        y: 0,
        width: 340,
        height: 56,
        fontSize: 40,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "thank-you",
    title: "Cảm ơn",
    category: "text",
    keywords: "cam on thank you",
    grouped: false,
    elements: [
      text("Cảm ơn", {
        x: 0,
        y: 0,
        width: 280,
        height: 56,
        fontSize: 48,
        fontFamily: "Great Vibes",
      }),
    ],
  },
  {
    id: "rsvp",
    title: "RSVP",
    category: "text",
    keywords: "rsvp xac nhan",
    grouped: false,
    elements: [
      text("RSVP", {
        x: 0,
        y: 0,
        width: 220,
        height: 44,
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: 10,
      }),
    ],
  },
  {
    id: "together",
    title: "The Wedding Of",
    category: "text",
    keywords: "wedding cuoi the wedding of",
    grouped: false,
    elements: [
      text("The Wedding Of", {
        x: 0,
        y: 0,
        width: 360,
        height: 48,
        fontSize: 22,
        fontFamily: "Cormorant Garamond",
        letterSpacing: 4,
        textTransform: "uppercase",
      }),
    ],
  },
  {
    id: "menu",
    title: "Thực đơn",
    category: "text",
    keywords: "thuc don menu",
    grouped: false,
    elements: [
      text("THỰC ĐƠN", {
        x: 0,
        y: 0,
        width: 280,
        height: 44,
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 8,
      }),
    ],
  },

  {
    id: "combo-graduation",
    title: "Cụm lễ tốt nghiệp",
    category: "combo",
    keywords: "tot nghiep graduation combo le",
    grouped: true,
    elements: [
      shape("line", { x: 40, y: 0, width: 280, height: 2, fill: TAN }),
      text("LỄ TỐT NGHIỆP", {
        x: 0,
        y: 18,
        width: 360,
        height: 44,
        fontSize: 26,
        fontWeight: "bold",
        letterSpacing: 6,
        textTransform: "uppercase",
      }),
      text("Class of 2026", {
        x: 0,
        y: 64,
        width: 360,
        height: 40,
        fontSize: 32,
        fontFamily: "Great Vibes",
        color: MUTED,
      }),
      shape("line", { x: 40, y: 112, width: 280, height: 2, fill: TAN }),
    ],
  },
  {
    id: "combo-birthday",
    title: "Cụm sinh nhật",
    category: "combo",
    keywords: "sinh nhat birthday combo",
    grouped: true,
    elements: [
      text("Happy Birthday", {
        x: 0,
        y: 0,
        width: 360,
        height: 48,
        fontSize: 36,
        fontFamily: "Great Vibes",
      }),
      text("TÊN BẠN", {
        x: 0,
        y: 52,
        width: 360,
        height: 36,
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 8,
        textTransform: "uppercase",
      }),
    ],
  },
  {
    id: "combo-save-date",
    title: "Cụm Save the Date",
    category: "combo",
    keywords: "save the date combo ngay",
    grouped: true,
    elements: [
      text("Save the Date", {
        x: 0,
        y: 0,
        width: 360,
        height: 44,
        fontSize: 34,
        fontFamily: "Great Vibes",
      }),
      text("12 · 12 · 2026", {
        x: 0,
        y: 50,
        width: 360,
        height: 32,
        fontSize: 16,
        fontFamily: "Cormorant Garamond",
        letterSpacing: 4,
      }),
    ],
  },
  {
    id: "combo-invite",
    title: "Cụm thân mời",
    category: "combo",
    keywords: "than moi invited combo",
    grouped: true,
    elements: [
      text("Thân mời", {
        x: 0,
        y: 0,
        width: 360,
        height: 40,
        fontSize: 28,
        fontFamily: "Great Vibes",
        color: MUTED,
      }),
      text("Tên A  &  Tên B", {
        x: 0,
        y: 44,
        width: 360,
        height: 48,
        fontSize: 28,
        fontFamily: "Playfair Display",
        fontWeight: "bold",
      }),
    ],
  },
  {
    id: "combo-opening",
    title: "Cụm khai trương",
    category: "combo",
    keywords: "khai truong opening combo",
    grouped: true,
    elements: [
      text("TRÂN TRỌNG KÍNH MỜI", {
        x: 0,
        y: 0,
        width: 360,
        height: 24,
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: MUTED,
      }),
      text("LỄ KHAI TRƯƠNG", {
        x: 0,
        y: 28,
        width: 360,
        height: 44,
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 4,
      }),
    ],
  },
  {
    id: "combo-thanks",
    title: "Cụm cảm ơn",
    category: "combo",
    keywords: "cam on thank you combo",
    grouped: true,
    elements: [
      text("Cảm ơn", {
        x: 0,
        y: 0,
        width: 360,
        height: 48,
        fontSize: 40,
        fontFamily: "Great Vibes",
      }),
      text("vì đã hiện diện", {
        x: 0,
        y: 50,
        width: 360,
        height: 28,
        fontSize: 14,
        fontFamily: "Cormorant Garamond",
        fontStyle: "italic",
        color: MUTED,
      }),
    ],
  },

  {
    id: "frame-lines-heart",
    title: "Dải tim",
    category: "frame",
    keywords: "khung line heart hoa tiet divider",
    grouped: true,
    elements: [
      shape("line", { x: 0, y: 18, width: 140, height: 2, fill: TAN }),
      shape("heart", { x: 154, y: 4, width: 28, height: 28, fill: INK }),
      shape("line", { x: 196, y: 18, width: 140, height: 2, fill: TAN }),
    ],
  },
  {
    id: "frame-double-line",
    title: "Hai đường kẻ",
    category: "frame",
    keywords: "khung line divider",
    grouped: true,
    elements: [
      shape("line", { x: 0, y: 0, width: 320, height: 2, fill: INK }),
      shape("line", { x: 0, y: 8, width: 320, height: 1, fill: TAN }),
    ],
  },
  {
    id: "frame-circle",
    title: "Vòng tròn",
    category: "frame",
    keywords: "khung circle vong tron",
    grouped: false,
    elements: [
      shape("circle", {
        x: 0,
        y: 0,
        width: 160,
        height: 160,
        fill: "transparent",
        stroke: INK,
        strokeWidth: 2,
      }),
    ],
  },
  {
    id: "frame-corners",
    title: "Góc khung",
    category: "frame",
    keywords: "khung corner goc",
    grouped: true,
    elements: [
      shape("line", { x: 0, y: 0, width: 48, height: 2, fill: INK }),
      shape("line", { x: 0, y: 0, width: 2, height: 48, fill: INK }),
      shape("line", { x: 232, y: 0, width: 48, height: 2, fill: INK }),
      shape("line", { x: 278, y: 0, width: 2, height: 48, fill: INK }),
      shape("line", { x: 0, y: 160, width: 2, height: 48, fill: INK }),
      shape("line", { x: 0, y: 206, width: 48, height: 2, fill: INK }),
      shape("line", { x: 278, y: 160, width: 2, height: 48, fill: INK }),
      shape("line", { x: 232, y: 206, width: 48, height: 2, fill: INK }),
    ],
  },
  {
    id: "frame-stars",
    title: "Ba ngôi sao",
    category: "frame",
    keywords: "sao star hoa tiet",
    grouped: true,
    elements: [
      shape("star", { x: 0, y: 8, width: 22, height: 22, fill: TAN }),
      shape("star", { x: 36, y: 0, width: 32, height: 32, fill: INK }),
      shape("star", { x: 80, y: 8, width: 22, height: 22, fill: TAN }),
    ],
  },
  {
    id: "frame-photo",
    title: "Khung ảnh",
    category: "frame",
    keywords: "khung anh photo frame",
    grouped: false,
    elements: [
      shape("rect", {
        x: 0,
        y: 0,
        width: 220,
        height: 280,
        fill: PAPER,
        stroke: INK,
        strokeWidth: 3,
      }),
    ],
  },

  {
    id: "badge-invite",
    title: "Nhãn thân mời",
    category: "badge",
    keywords: "nhan badge than moi",
    grouped: true,
    elements: [
      shape("rect", {
        x: 0,
        y: 0,
        width: 180,
        height: 40,
        fill: INK,
      }),
      text("THÂN MỜI", {
        x: 0,
        y: 6,
        width: 180,
        height: 28,
        fontSize: 12,
        fontWeight: "bold",
        letterSpacing: 3,
        color: PAPER,
      }),
    ],
  },
  {
    id: "badge-rsvp",
    title: "Nhãn RSVP",
    category: "badge",
    keywords: "nhan badge rsvp",
    grouped: true,
    elements: [
      shape("rect", {
        x: 0,
        y: 0,
        width: 140,
        height: 36,
        fill: "transparent",
        stroke: INK,
        strokeWidth: 1.5,
      }),
      text("RSVP", {
        x: 0,
        y: 6,
        width: 140,
        height: 24,
        fontSize: 12,
        fontWeight: "bold",
        letterSpacing: 4,
      }),
    ],
  },
  {
    id: "badge-date",
    title: "Nhãn ngày",
    category: "badge",
    keywords: "nhan badge ngay date",
    grouped: true,
    elements: [
      shape("circle", { x: 0, y: 0, width: 88, height: 88, fill: INK }),
      text("12", {
        x: 0,
        y: 18,
        width: 88,
        height: 32,
        fontSize: 22,
        fontWeight: "bold",
        color: PAPER,
      }),
      text("TH12", {
        x: 0,
        y: 50,
        width: 88,
        height: 20,
        fontSize: 10,
        letterSpacing: 2,
        color: PAPER,
      }),
    ],
  },
];

export function centerPresetOnCanvas(
  elements: PresetTemplateEl[],
  canvasWidth = 440,
  dropY = 180,
): PresetTemplateEl[] {
  const minX = Math.min(...elements.map((e) => e.x));
  const minY = Math.min(...elements.map((e) => e.y));
  const maxX = Math.max(...elements.map((e) => e.x + e.width));
  const width = Math.max(1, maxX - minX);
  const dx = (canvasWidth - width) / 2 - minX;
  const dy = dropY - minY;
  return elements.map((el) => ({ ...el, x: el.x + dx, y: el.y + dy }));
}
