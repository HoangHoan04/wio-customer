import type { EditorElement, EditorTool } from "../types";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1200;
export const MIN_ZOOM = 25;
export const MAX_ZOOM = 200;
export const ZOOM_STEP = 10;

export interface ToolDef {
  id: EditorTool;
  label: string;
  icon: string;
}

export const TOOLS: ToolDef[] = [
  { id: "text", label: "Văn bản", icon: "Type" },
  { id: "uploads", label: "Hình ảnh", icon: "Image" },
  { id: "stock", label: "Stock", icon: "Sticker" },
  { id: "shape", label: "Hình dạng", icon: "Shapes" },
  { id: "background", label: "Nền", icon: "Palette" },
  { id: "music", label: "Âm nhạc", icon: "Music" },
  { id: "utility", label: "Tiện ích", icon: "Wand2" },
  { id: "preset", label: "Preset", icon: "LayoutDashboard" },
  { id: "template", label: "Mẫu", icon: "Layers" },
  { id: "effect", label: "Hiệu ứng", icon: "Film" },
];

export const FONTS = [
  "Arial",
  "Arial Black",
  "Baskerville",
  "Brush Script MT",
  "Calibri",
  "Cambria",
  "Candara",
  "Century Gothic",
  "Comic Sans MS",
  "Consolas",
  "Copperplate Gothic",
  "Courier New",
  "EB Garamond",
  "Franklin Gothic Medium",
  "Garamond",
  "Georgia",
  "Great Vibes",
  "Helvetica",
  "Impact",
  "Inter",
  "Lucida Console",
  "Lucida Handwriting",
  "Palatino Linotype",
  "Playfair Display",
  "Segoe Print",
  "Segoe Script",
  "Segoe UI",
  "Tahoma",
  "Tangerine",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

export const FONT_SIZES = [
  8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 84, 96,
];

export const WEDDING_BG_COLORS = [
  "transparent",
  "#000000",
  "#555555",
  "#888888",
  "#CCCCCC",
  "#FFFFFF",
  "#C0392B",
  "#9B59B6",
  "#2980B9",
  "#1ABC9C",
  "#27AE60",
  "#E67E22",
  "#E74C3C",
  "#8E44AD",
  "#3498DB",
  "#16A085",
  "#2ECC71",
  "#F1C40F",
  "#FFB6C1",
  "#E6E6FA",
  "#87CEFA",
  "#98FB98",
  "#ADFF2F",
  "#FFE4C4",
  "#FFC0CB",
  "#BDE0FE",
  "#C1E1C1",
  "#C3B1E1",
  "#FEF08A",
  "#FBCFE8",
  "#FFE4E1",
  "#C7D2FE",
  "#86EFAC",
  "#E9D5FF",
  "#FEF9C3",
  "#FED7AA",
];

export const WEDDING_GRADIENT_COLORS = [
  "linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)",
  "linear-gradient(135deg, #5C7CFA 0%, #3B5BDB 100%)",
  "linear-gradient(135deg, #38BDF8 0%, #0369A1 100%)",
  "linear-gradient(135deg, #34D399 0%, #059669 100%)",
  "linear-gradient(135deg, #A7F3D0 0%, #F0FDF4 100%)",
  "linear-gradient(135deg, #FFA1A1 0%, #FFC3A0 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
  "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
  "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
  "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
  "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)",
  "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)",
];

export const SYSTEM_WALLPAPERS = [
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
  "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400",
  "https://images.unsplash.com/photo-1554034483-04fda0d350e3?w=400",
];

export const WEDDING_SHAPES = [
  { name: "Hình chữ nhật", type: "rect" as const },
  { name: "Hình vuông", type: "square" as const },
  { name: "Hình tròn", type: "circle" as const },
  { name: "Hình tam giác", type: "triangle" as const },
  { name: "Đường kẻ", type: "line" as const },
  { name: "Ngôi sao", type: "star" as const },
  { name: "Trái tim", type: "heart" as const },
  { name: "Lục giác", type: "hexagon" as const },
];

export const SHAPE_LABELS: Record<string, string> = {
  rect: "▭",
  square: "□",
  circle: "○",
  triangle: "△",
  line: "─",
  star: "☆",
  heart: "♡",
  hexagon: "⬡",
};

export function createDefaultText(id: string): EditorElement {
  return {
    id,
    type: "text",
    x: 100,
    y: 100,
    width: 120,
    height: 30,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: Date.now(),
    content: "Nhập văn bản",
    fontSize: 14,
    fontFamily: "Playfair Display",
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#8B4513",
    fill: "#8B4513",
    stroke: "",
    strokeWidth: 0,
    letterSpacing: 0,
    lineHeight: 1.5,
    textDecoration: "none",
    textTransform: "none",
    backgroundColor: "transparent",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderStyle: "solid",
    borderPosition: "all",
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    shadowColor: "#000000",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    link: "",
    motionEnabled: false,
    motionType: "fadeIn",
    motionDuration: 1,
    motionDelay: 0,
    motionEasing: "easeOut",
    continuousMotionEnabled: false,
    continuousMotionType: "float",
    continuousMotionDuration: 2,
    continuousMotionDelay: 0,
    src: "",
    shapeType: "rect",
  };
}

export function createDefaultShape(
  id: string,
  shapeType:
    | "rect"
    | "circle"
    | "triangle"
    | "line"
    | "square"
    | "star"
    | "heart"
    | "hexagon",
): EditorElement {
  let width = 150;
  let height = 150;

  if (shapeType === "line") {
    width = 300;
    height = 4;
  } else if (shapeType === "rect") {
    width = 200;
    height = 100;
  }

  return {
    id,
    type: "shape",
    x: 200,
    y: 200,
    width,
    height,
    rotation: 0,
    opacity: 0.8,
    visible: true,
    locked: false,
    zIndex: Date.now(),
    content: "",
    fontSize: 14,
    fontFamily: "Arial",
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    color: "#D4AF37",
    fill: "#D4AF37",
    stroke: "#333",
    strokeWidth: 2,
    letterSpacing: 0,
    lineHeight: 1.5,
    textDecoration: "none",
    textTransform: "none",
    backgroundColor: "transparent",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderStyle: "solid",
    borderPosition: "all",
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    shadowColor: "#000000",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    link: "",
    motionEnabled: false,
    motionType: "fadeIn",
    motionDuration: 1,
    motionDelay: 0,
    motionEasing: "easeOut",
    continuousMotionEnabled: false,
    continuousMotionType: "float",
    continuousMotionDuration: 2,
    continuousMotionDelay: 0,
    src: "",
    shapeType,
  };
}

export function createDefaultImage(id: string, src: string): EditorElement {
  return {
    id,
    type: "image",
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: Date.now(),
    content: "",
    fontSize: 14,
    fontFamily: "Arial",
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#000000",
    fill: "transparent",
    stroke: "",
    strokeWidth: 0,
    letterSpacing: 0,
    lineHeight: 1.5,
    textDecoration: "none",
    textTransform: "none",
    backgroundColor: "transparent",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderStyle: "solid",
    borderPosition: "all",
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    shadowColor: "#000000",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    link: "",
    motionEnabled: false,
    motionType: "fadeIn",
    motionDuration: 1,
    motionDelay: 0,
    motionEasing: "easeOut",
    continuousMotionEnabled: false,
    continuousMotionType: "float",
    continuousMotionDuration: 2,
    continuousMotionDelay: 0,
    src,
    shapeType: "rect",
  };
}

export const ALIGN_ITEMS = [
  { value: "left" as const, icon: "AlignLeft", label: "Trái" },
  { value: "center" as const, icon: "AlignCenter", label: "Giữa" },
  { value: "right" as const, icon: "AlignRight", label: "Phải" },
];

export const BORDER_STYLES = [
  { value: "solid", label: "Nét liền" },
  { value: "dashed", label: "Gạch ngang" },
  { value: "dotted", label: "Chấm" },
  { value: "double", label: "Kép" },
];

export const BORDER_POSITIONS = [
  { value: "all", label: "Toàn bộ" },
  { value: "top", label: "Trên" },
  { value: "bottom", label: "Dưới" },
  { value: "left", label: "Trái" },
  { value: "right", label: "Phải" },
  { value: "top-left", label: "Trên + Trái" },
  { value: "top-right", label: "Trên + Phải" },
  { value: "bottom-left", label: "Dưới + Trái" },
  { value: "bottom-right", label: "Dưới + Phải" },
];

export const PADDING_MODES = [
  { value: "all", label: "Cả 4 hướng" },
  { value: "horizontal", label: "Chiều ngang" },
  { value: "vertical", label: "Chiều dọc" },
  { value: "custom", label: "Tùy chỉnh" },
];

export const BORDER_RADIUS_MODES = [
  { value: "all", label: "Cả 4 góc" },
  { value: "top", label: "2 góc trên" },
  { value: "bottom", label: "2 góc dưới" },
  { value: "left", label: "2 góc trái" },
  { value: "right", label: "2 góc phải" },
  { value: "tl-br", label: "Trái trên + Phải dưới" },
  { value: "tr-bl", label: "Phải trên + Trái dưới" },
  { value: "tl", label: "Trái trên" },
  { value: "tr", label: "Phải trên" },
  { value: "bl", label: "Trái dưới" },
  { value: "br", label: "Phải dưới" },
  { value: "custom", label: "Tùy chỉnh" },
];

export const MOTION_TYPES = [
  { value: "fadeIn", label: "Hiện dần" },
  { value: "fadeOut", label: "Biến mất" },
  { value: "slideInLeft", label: "Trượt từ trái" },
  { value: "slideInRight", label: "Trượt từ phải" },
  { value: "slideInUp", label: "Trượt từ trên" },
  { value: "slideInDown", label: "Trượt từ dưới" },
  { value: "zoomIn", label: "Phóng to" },
  { value: "zoomOut", label: "Thu nhỏ" },
  { value: "bounceIn", label: "Nảy vào" },
  { value: "rotateIn", label: "Xoay vào" },
  { value: "flipInX", label: "Lật ngang" },
  { value: "flipInY", label: "Lật dọc" },
  { value: "lightSpeedIn", label: "Tốc độ ánh sáng" },
  { value: "rollIn", label: "Lăn vào" },
];

export const CONTINUOUS_MOTION_TYPES = [
  { value: "float", label: "Bay lơ lửng" },
  { value: "bounce", label: "Nảy" },
  { value: "spin", label: "Xoay tròn" },
  { value: "shake", label: "Lắc" },
  { value: "pulse", label: "Nhấp nháy" },
  { value: "swing", label: "Đu đưa" },
  { value: "wobble", label: "Rung" },
  { value: "tada", label: "Nhảy múa" },
];

export const EASING_TYPES = [
  { value: "linear", label: "Linear" },
  { value: "ease", label: "Ease" },
  { value: "easeIn", label: "Ease In" },
  { value: "easeOut", label: "Ease Out" },
  { value: "easeInOut", label: "Ease In Out" },
  { value: "elasticIn", label: "Elastic In" },
  { value: "elasticOut", label: "Elastic Out" },
  { value: "bounceIn", label: "Bounce In" },
  { value: "bounceOut", label: "Bounce Out" },
];

export const PRESET_COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#FFFFFF",
  "#FF0000",
  "#FF4444",
  "#FF8888",
  "#FFCCCC",
  "#FF6600",
  "#FF9944",
  "#FFBB88",
  "#FFDDCC",
  "#FFCC00",
  "#FFDD44",
  "#FFEE88",
  "#FFF5CC",
  "#00CC00",
  "#44DD44",
  "#88EE88",
  "#CCFFCC",
  "#0066FF",
  "#4488FF",
  "#88AAFF",
  "#CCDDFF",
  "#6600CC",
  "#8844DD",
  "#AA88EE",
  "#DDCCFF",
  "#8B4513",
  "#A0522D",
  "#CD853F",
  "#DEB887",
  "#D4AF37",
  "#FFD700",
  "#F5C842",
  "#F5E6D3",
];
