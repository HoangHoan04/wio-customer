import type { EditorElement } from "../types";
import { googleFontStylesheetUrls } from "./font-catalog";

export const MIN_TEXT_WIDTH = 24;
export const MIN_TEXT_FONT_SIZE = 8;
export const MAX_TEXT_FONT_SIZE = 400;

export function ensureEditorFonts() {
  if (typeof document === "undefined") return;

  if (!document.getElementById("invigo-editor-fonts-preconnect")) {
    const preconnect = document.createElement("link");
    preconnect.id = "invigo-editor-fonts-preconnect";
    preconnect.rel = "preconnect";
    preconnect.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect);

    const gstatic = document.createElement("link");
    gstatic.rel = "preconnect";
    gstatic.href = "https://fonts.gstatic.com";
    gstatic.crossOrigin = "anonymous";
    document.head.appendChild(gstatic);
  }

  googleFontStylesheetUrls().forEach((href, index) => {
    const id = `invigo-editor-google-fonts-${index}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });
}

const TEXT_FIT_KEYS: (keyof EditorElement)[] = [
  "content",
  "fontSize",
  "fontFamily",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "textTransform",
  "width",
];

export function displayTextContent(
  content: string,
  transform?: EditorElement["textTransform"],
) {
  const value = content || "";
  switch (transform) {
    case "uppercase":
      return value.toUpperCase();
    case "lowercase":
      return value.toLowerCase();
    case "capitalize":
      return value.replace(/\b\w/g, (c) => c.toUpperCase());
    default:
      return value;
  }
}

export function konvaFontStyle(el: {
  fontWeight?: string;
  fontStyle?: string;
}) {
  return (
    `${el.fontWeight === "bold" ? "bold " : ""}${el.fontStyle === "italic" ? "italic" : ""}`.trim() ||
    "normal"
  );
}

type MeasurableText = Pick<
  EditorElement,
  | "content"
  | "fontSize"
  | "fontFamily"
  | "fontWeight"
  | "fontStyle"
  | "letterSpacing"
  | "lineHeight"
  | "textTransform"
> & { width?: number };

let measureCtx: CanvasRenderingContext2D | null = null;

function getMeasureCtx() {
  if (typeof document === "undefined") return null;
  if (!measureCtx) {
    measureCtx = document.createElement("canvas").getContext("2d");
  }
  return measureCtx;
}

function fallbackSize(
  text: string,
  fontSize: number,
  lineHeight: number,
  maxWidth?: number,
) {
  const lines = text.split("\n");
  const guessed = Math.ceil(
    Math.max(...lines.map((line) => line.length), 1) * fontSize * 0.55,
  );
  const width = Math.max(
    MIN_TEXT_WIDTH,
    Math.min(maxWidth ?? guessed, guessed),
  );
  return {
    width,
    height: Math.ceil(Math.max(1, lines.length) * fontSize * lineHeight),
  };
}

function lineWidth(
  ctx: CanvasRenderingContext2D,
  line: string,
  letterSpacing: number,
) {
  const base = ctx.measureText(line).width;
  if (!letterSpacing || line.length < 2) return base;
  return base + letterSpacing * (line.length - 1);
}

function wrapLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  maxWidth: number,
  letterSpacing: number,
) {
  if (!line) return [""];
  if (lineWidth(ctx, line, letterSpacing) <= maxWidth) return [line];

  const words = line.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (lineWidth(ctx, next, letterSpacing) <= maxWidth || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function measureTextBox(
  el: MeasurableText,
  mode: "hug" | "wrap" = "wrap",
  maxWidth?: number,
): { width: number; height: number } {
  const fontSize = el.fontSize || 16;
  const lineHeight = el.lineHeight || 1.2;
  const text = displayTextContent(el.content, el.textTransform) || " ";

  try {
    const ctx = getMeasureCtx();
    if (!ctx) return fallbackSize(text, fontSize, lineHeight, maxWidth);

    ctx.font = `${konvaFontStyle(el)} ${fontSize}px "${el.fontFamily || "Inter"}", sans-serif`;
    const letterSpacing = el.letterSpacing ?? 0;
    const rawLines = text.split("\n");

    let width: number;
    let lines: string[];

    if (mode === "wrap" && el.width) {
      width = Math.max(MIN_TEXT_WIDTH, Math.round(el.width));
      if (maxWidth) width = Math.min(width, Math.round(maxWidth));
      lines = rawLines.flatMap((line) =>
        wrapLine(ctx, line, width, letterSpacing),
      );
    } else {
      width = Math.max(
        MIN_TEXT_WIDTH,
        Math.ceil(
          Math.max(
            ...rawLines.map((line) => lineWidth(ctx, line, letterSpacing)),
            0,
          ) + 4,
        ),
      );
      if (maxWidth && width > maxWidth) {
        width = Math.max(MIN_TEXT_WIDTH, Math.round(maxWidth));
        lines = rawLines.flatMap((line) =>
          wrapLine(ctx, line, width, letterSpacing),
        );
      } else {
        lines = rawLines;
      }
    }

    const height = Math.max(
      Math.ceil(fontSize * lineHeight),
      Math.ceil(Math.max(1, lines.length) * fontSize * lineHeight),
    );

    return {
      width: Number.isFinite(width) ? width : MIN_TEXT_WIDTH,
      height: Number.isFinite(height)
        ? height
        : Math.ceil(fontSize * lineHeight),
    };
  } catch {
    return fallbackSize(text, fontSize, lineHeight, maxWidth);
  }
}

export function shouldRefitTextHeight(updates: Partial<EditorElement>) {
  return TEXT_FIT_KEYS.some((key) => key in updates);
}

export function withFittedTextHeight<T extends MeasurableText>(
  el: T,
): T & {
  height: number;
} {
  const { height } = measureTextBox(el, "wrap");
  return { ...el, height };
}
