export type EditorTool =
  | "text"
  | "uploads"
  | "stock"
  | "shape"
  | "background"
  | "music"
  | "utility"
  | "preset"
  | "template"
  | "effect"
  | "property";

export type ElementType = "text" | "image" | "shape" | "widget";

export type WidgetType =
  | "calendar"
  | "countdown"
  | "map"
  | "call"
  | "rsvp"
  | "qr"
  | "album"
  | "carousel"
  | "gallery"
  | "music"
  | "youtube";

export interface WidgetConfig {
  calendarEnabled?: boolean;
  calendarDisplayMode?: "full" | "date-only";
  calendarStyle?: "classic" | "modern" | "romantic" | "luxury-navy";
  targetDate?: string;
  eventTitle?: string;
  eventLocation?: string;
  eventDescription?: string;
  countdownEnabled?: boolean;
  countdownType?: "hours-min-sec" | "days-hours-min-sec";
  countdownTarget?: string;
  countdownStyle?: "classic" | "modern" | "romantic" | "luxury-navy";
  countdownOrientation?: "horizontal" | "vertical";
  mapEnabled?: boolean;
  locationAddress?: string;
  mapType?: "normal" | "satellite" | "terrain" | "hybrid";
  mapEmbedUrl?: string;
  contactEnabled?: boolean;
  contactActiveTab?: "phone" | "messenger" | "zalo";
  phoneEnabled?: boolean;
  phoneLabel?: string;
  phoneNumber?: string;
  messengerEnabled?: boolean;
  messengerLabel?: string;
  messengerUrl?: string;
  zaloEnabled?: boolean;
  zaloLabel?: string;
  zaloPhone?: string;
  rsvpEnabled?: boolean;
  rsvpType?: "button" | "full-form";
  rsvpTargetEmail?: string;
  rsvpAutoConfirmEmail?: boolean;
  qrEnabled?: boolean;
  qrTarget?: "groom" | "bride" | "both";
  groomAccountName?: string;
  groomAccountNumber?: string;
  groomBankName?: string;
  groomQrUrl?: string;
  brideAccountName?: string;
  brideAccountNumber?: string;
  brideBankName?: string;
  brideQrUrl?: string;
  galleryEnabled?: boolean;
  galleryLayout?: "grid" | "collage" | "3d";
  images?: string[];
  audioEnabled?: boolean;
  audioUrl?: string;
  musicDisplayMode?: "full" | "icon-only";
  songTitle?: string;
  artistName?: string;
  iconId?: string;
  audioSource?: "admin" | "user";
  youtubeEnabled?: boolean;
  youtubeUrl?: string;
  color?: string;
  fontFamily?: string;
  qrTitle?: string;
  groomLabel?: string;
  brideLabel?: string;
}

export interface EditorElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;

  content: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: "normal" | "italic";
  fontWeight: "normal" | "bold";
  textAlign: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom";
  color: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  letterSpacing: number;
  lineHeight: number;
  textDecoration:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  backgroundColor: string;
  frameAlignH?: "left" | "center" | "right";
  frameAlignV?: "top" | "middle" | "bottom";

  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  borderWidth: number;
  borderColor: string;
  borderStyle: "solid" | "dashed" | "dotted" | "double";
  borderPosition:
    | "all"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomLeft: number;
  borderRadiusBottomRight: number;

  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;

  link: string;

  motionEnabled: boolean;
  motionType: string;
  motionDuration: number;
  motionDelay: number;
  motionEasing: string;

  continuousMotionEnabled: boolean;
  continuousMotionType: string;
  continuousMotionDuration: number;
  continuousMotionDelay: number;

  src: string;
  shapeType:
    | "rect"
    | "circle"
    | "triangle"
    | "square"
    | "line"
    | "heart"
    | "star"
    | "hexagon";

  widgetType?: WidgetType;
  widgetConfig?: WidgetConfig;
  groupId?: string;
}

export type TextPreset = Partial<
  Pick<
    EditorElement,
    | "content"
    | "fontSize"
    | "fontFamily"
    | "fontStyle"
    | "fontWeight"
    | "textAlign"
    | "verticalAlign"
    | "color"
    | "fill"
    | "letterSpacing"
    | "lineHeight"
    | "textTransform"
    | "width"
    | "height"
    | "x"
    | "y"
  >
>;

export interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
  selectedTool: EditorTool;
  canvasBackground: string;
  zoom: number;
  history: EditorElement[][];
  historyIndex: number;
}

export type EditorAction =
  | { type: "SET_ELEMENTS"; payload: EditorElement[] }
  | { type: "ADD_ELEMENT"; payload: EditorElement }
  | {
      type: "UPDATE_ELEMENT";
      payload: { id: string; updates: Partial<EditorElement> };
    }
  | { type: "DELETE_ELEMENT"; payload: string }
  | { type: "REORDER_ELEMENTS"; payload: EditorElement[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SELECT_TOOL"; payload: EditorTool }
  | { type: "SELECT_ELEMENT"; payload: string | null }
  | { type: "SET_BACKGROUND"; payload: string }
  | { type: "SET_ZOOM"; payload: number };

export type IntroEffectType =
  | "none"
  | "fade"
  | "zoom"
  | "envelope"
  | "curtain"
  | "slide-up"
  | "blur"
  | "hearts";

export type ParticleEffectType =
  | "none"
  | "petals"
  | "hearts"
  | "snow"
  | "confetti"
  | "sparkles"
  | "leaves"
  | "bubbles"
  | "stars";

export type IntroTrigger = "auto" | "tap";

export interface InvitationEffects {
  intro: {
    type: IntroEffectType;
    duration: number;
    trigger: IntroTrigger;
  };
  particles: {
    type: ParticleEffectType;
    density: number;
  };
}
