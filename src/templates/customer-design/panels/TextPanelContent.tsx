import Button from "@/templates/customer-design/ui/button/Button";
import InputNumber from "@/templates/customer-design/ui/input/InputNumber";
import InputTextarea from "@/templates/customer-design/ui/input/InputTextarea";
import Select from "@/templates/customer-design/ui/Select";
import Slider from "@/templates/customer-design/ui/Slider";
import Switch from "@/templates/customer-design/ui/Switch";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDownFromLine,
  ArrowUpFromLine,
  Bold,
  CaseLower,
  CaseUpper,
  ChevronDown,
  Italic,
  Link2,
  Minus,
  Play,
  Plus,
  Repeat,
  Square,
  Strikethrough,
  Sun,
  Trash2,
  Underline,
} from "lucide-react";
import { useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import FormatButton from "../components/FormatButton";
import type { EditorElement, TextPreset } from "../types";
import {
  BORDER_POSITIONS,
  BORDER_RADIUS_MODES,
  BORDER_STYLES,
  CONTINUOUS_MOTION_TYPES,
  EASING_TYPES,
  FONT_SIZES,
  MOTION_TYPES,
  PADDING_MODES,
  TEXT_INSERT_STYLES,
  TEXT_STYLE_PRESETS,
} from "../utils/constants";
import { FONT_SELECT_OPTIONS } from "../utils/font-catalog";

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[#D9CDBE]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-xs font-semibold text-[#2D231F]">{title}</span>
        <ChevronDown
          size={16}
          className={`text-[#7A6A5C] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function InsertStyleButton({
  label,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  textTransform,
  onClick,
}: {
  label: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: string;
  letterSpacing?: number;
  textTransform?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-[#D9CDBE] bg-[#F3EDE3] px-4 py-4 text-left text-[#2D231F] transition-colors hover:border-[#2D231F] hover:bg-[#EDE4D5]"
    >
      <span
        className="block truncate leading-tight"
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing,
          textTransform: textTransform as React.CSSProperties["textTransform"],
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default function TextPanelContent({
  selectedElement,
  onUpdate,
  onDelete,
  onAddText,
  elements = [],
  onSelect,
  onAlignElement,
}: {
  selectedElement: EditorElement | null;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  onDelete: (id: string) => void;
  onAddText: (preset?: TextPreset) => void;
  elements?: EditorElement[];
  onSelect?: (id: string | null) => void;
  onAlignElement?: (
    id: string,
    align: { h?: "left" | "center" | "right"; v?: "top" | "middle" | "bottom" }
  ) => void;
}) {
  const el = selectedElement?.type === "text" ? selectedElement : null;

  const [paddingMode, setPaddingMode] = useState<string>("all");
  const [borderRadiusMode, setBorderRadiusMode] = useState<string>("all");

  const fontSizeOptions = FONT_SIZES.map((size) => ({
    label: String(size),
    value: size,
  }));

  const fontOptions = FONT_SELECT_OPTIONS;

  const textElements = elements.filter((e) => e.type === "text");

  if (!el) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          {TEXT_INSERT_STYLES.map((style) => (
            <InsertStyleButton
              key={style.id}
              label={style.label}
              fontFamily={style.preset.fontFamily}
              fontSize={style.panelFontSize}
              fontWeight={style.preset.fontWeight}
              letterSpacing={style.preset.letterSpacing}
              onClick={() => onAddText(style.preset)}
            />
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
            Kiểu chữ mặc định
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TEXT_STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => onAddText(style.preset)}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] px-2 py-4 text-[#2D231F] transition-colors hover:border-[#2D231F] hover:bg-[#F3EDE3]"
              >
                <span
                  className="max-w-full truncate leading-none"
                  style={{
                    fontFamily: `"${style.preset.fontFamily}", serif`,
                    fontSize: Math.min(
                      34,
                      Math.max(20, Math.round((style.preset.fontSize || 28) * 0.65)),
                    ),
                    fontWeight: style.preset.fontWeight,
                    letterSpacing: style.preset.letterSpacing,
                    textTransform: style.preset.textTransform,
                  }}
                >
                  Aa
                </span>
                <span className="text-[10px] text-[#7A6A5C]">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {textElements.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
              Trên thiệp
            </p>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {textElements.map((textEl) => (
                <button
                  key={textEl.id}
                  type="button"
                  onClick={() => onSelect?.(textEl.id)}
                  className="w-full truncate rounded-lg border border-[#D9CDBE] bg-[#F3EDE3] px-3 py-2 text-left text-xs text-[#2D231F] transition-colors hover:border-[#2D231F]"
                  style={{ fontFamily: textEl.fontFamily }}
                >
                  {textEl.content || "Văn bản trống"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handlePaddingChange = (side: "top" | "right" | "bottom" | "left", val: number) => {
    const updates: Record<string, number> = {};
    updates[`padding${side.charAt(0).toUpperCase() + side.slice(1)}`] = val;
    if (paddingMode === "all") {
      updates.paddingTop = val;
      updates.paddingRight = val;
      updates.paddingBottom = val;
      updates.paddingLeft = val;
    } else if (paddingMode === "horizontal") {
      if (side === "left" || side === "right") {
        updates.paddingLeft = val;
        updates.paddingRight = val;
      }
    } else if (paddingMode === "vertical") {
      if (side === "top" || side === "bottom") {
        updates.paddingTop = val;
        updates.paddingBottom = val;
      }
    }
    onUpdate(el.id, updates);
  };

  const getBorderRadiusCorners = (mode: string, changedCorner: string): string[] => {
    switch (mode) {
      case "all":
        return [
          "borderRadiusTopLeft",
          "borderRadiusTopRight",
          "borderRadiusBottomLeft",
          "borderRadiusBottomRight",
        ];
      case "top":
        return ["borderRadiusTopLeft", "borderRadiusTopRight"];
      case "bottom":
        return ["borderRadiusBottomLeft", "borderRadiusBottomRight"];
      case "left":
        return ["borderRadiusTopLeft", "borderRadiusBottomLeft"];
      case "right":
        return ["borderRadiusTopRight", "borderRadiusBottomRight"];
      case "tl-br":
        return ["borderRadiusTopLeft", "borderRadiusBottomRight"];
      case "tr-bl":
        return ["borderRadiusTopRight", "borderRadiusBottomLeft"];
      case "tl":
        return ["borderRadiusTopLeft"];
      case "tr":
        return ["borderRadiusTopRight"];
      case "bl":
        return ["borderRadiusBottomLeft"];
      case "br":
        return ["borderRadiusBottomRight"];
      default:
        return [changedCorner];
    }
  };

  const handleBorderRadiusChange = (corner: string, val: number) => {
    const corners = getBorderRadiusCorners(borderRadiusMode, corner);
    const updates: Record<string, number> = {};
    corners.forEach((c) => {
      updates[c] = val;
    });
    onUpdate(el.id, updates);
  };

  const stepFontSize = (dir: -1 | 1) => {
    const currentSize = el.fontSize || 16;
    const idx = FONT_SIZES.indexOf(currentSize);
    if (idx === -1) {
      const nearest = FONT_SIZES.reduce((best, size) =>
        Math.abs(size - currentSize) < Math.abs(best - currentSize) ? size : best
      );
      const nearestIdx = FONT_SIZES.indexOf(nearest);
      const next = FONT_SIZES[Math.min(FONT_SIZES.length - 1, Math.max(0, nearestIdx + dir))];
      onUpdate(el.id, { fontSize: next });
      return;
    }
    const nextIdx = idx + dir;
    if (nextIdx >= 0 && nextIdx < FONT_SIZES.length) {
      onUpdate(el.id, { fontSize: FONT_SIZES[nextIdx] });
    }
  };

  return (
    <div
      onKeyDown={(e) => e.stopPropagation()}
      className="space-y-3"
    >
      <button
        type="button"
        onClick={() => onSelect?.(null)}
        className="text-left text-xs text-[#7A6A5C] transition-colors hover:text-[#2D231F]"
      >
        ← Thêm văn bản khác
      </button>

      <Select
        size="sm"
        searchable
        value={el.fontFamily}
        options={fontOptions}
        onValueChange={(val) => onUpdate(el.id, { fontFamily: String(val) })}
        className="bg-[#F3EDE3]! text-[#2D231F]! border-[#D9CDBE]!"
        wrapperClassName="w-full"
        placeholder="Font chữ"
        popupClassName="min-w-64"
      />

      <div className="flex items-center gap-1.5">
        <Button
          onClick={() => stepFontSize(-1)}
          variant="outline"
          className="h-9! w-9! shrink-0 flex items-center justify-center rounded-lg! border! border-[#D9CDBE]! bg-[#F3EDE3]! text-[#2D231F]! hover:bg-[#EDE4D5]!"
          leftIcon={<Minus size={14} />}
        />
        <Select
          size="sm"
          options={fontSizeOptions}
          value={el.fontSize}
          defaultValue={16}
          onValueChange={(val) => onUpdate(el.id, { fontSize: Number(val) })}
          className="bg-[#F3EDE3]! text-[#2D231F]! border-[#D9CDBE]! text-center"
          wrapperClassName="flex-1"
        />
        <Button
          onClick={() => stepFontSize(1)}
          variant="outline"
          className="h-9! w-9! shrink-0 flex items-center justify-center rounded-lg! border! border-[#D9CDBE]! bg-[#F3EDE3]! text-[#2D231F]! hover:bg-[#EDE4D5]!"
          leftIcon={<Plus size={14} />}
        />
      </div>

      <ColorPickerRow
        value={el.color}
        onChange={(v) => onUpdate(el.id, { color: v, fill: v })}
      />

      <div className="flex flex-wrap items-center gap-0.5">
        <FormatButton
          active={el.fontWeight === "bold"}
          onClick={() =>
            onUpdate(el.id, { fontWeight: el.fontWeight === "bold" ? "normal" : "bold" })
          }
          title="Bôi đậm"
        >
          <Bold size={15} />
        </FormatButton>
        <FormatButton
          active={el.fontStyle === "italic"}
          onClick={() =>
            onUpdate(el.id, { fontStyle: el.fontStyle === "italic" ? "normal" : "italic" })
          }
          title="Chữ nghiêng"
        >
          <Italic size={15} />
        </FormatButton>
        <FormatButton
          active={el.textDecoration.includes("underline")}
          onClick={() => {
            const next =
              el.textDecoration === "underline"
                ? "none"
                : el.textDecoration === "line-through"
                  ? "underline line-through"
                  : "underline";
            onUpdate(el.id, { textDecoration: next });
          }}
          title="Gạch chân"
        >
          <Underline size={15} />
        </FormatButton>
        <FormatButton
          active={el.textDecoration.includes("line-through")}
          onClick={() => {
            const next =
              el.textDecoration === "line-through"
                ? "none"
                : el.textDecoration === "underline"
                  ? "underline line-through"
                  : "line-through";
            onUpdate(el.id, { textDecoration: next });
          }}
          title="Gạch ngang"
        >
          <Strikethrough size={15} />
        </FormatButton>
        <FormatButton
          active={el.textTransform !== "none"}
          onClick={() => {
            const next =
              el.textTransform === "uppercase"
                ? "none"
                : el.textTransform === "none"
                  ? "uppercase"
                  : "none";
            onUpdate(el.id, { textTransform: next });
          }}
          title="In hoa / In thường"
        >
          {el.textTransform === "uppercase" ? <CaseUpper size={15} /> : <CaseLower size={15} />}
        </FormatButton>
        <div className="mx-1 h-5 w-px bg-[#D9CDBE]" />
        {[
          { value: "left" as const, icon: AlignLeft, label: "Căn trái" },
          { value: "center" as const, icon: AlignCenter, label: "Căn giữa" },
          { value: "right" as const, icon: AlignRight, label: "Căn phải" },
          { value: "justify" as const, icon: AlignJustify, label: "Căn đều" },
        ].map(({ value, icon: Icon, label }) => (
          <FormatButton
            key={value}
            active={el.textAlign === value}
            onClick={() => onUpdate(el.id, { textAlign: value })}
            title={label}
          >
            <Icon size={15} />
          </FormatButton>
        ))}
      </div>

      <InputTextarea
        value={el.content}
        onChange={(e) => onUpdate(el.id, { content: e.target.value })}
        className="min-h-20 border-[#D9CDBE]! bg-[#F3EDE3]! px-3 py-2 text-xs! text-[#2D231F]!"
        placeholder="Nhập nội dung..."
      />

      <CollapsibleSection title="Khoảng cách">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="w-28 text-left text-[10px] uppercase text-[#7A6A5C]">
              Giãn chữ
            </label>
            <InputNumber
              min={-5}
              max={20}
              value={el.letterSpacing}
              onChange={(e) => onUpdate(el.id, { letterSpacing: Number(e.target.value) })}
              className="w-20! rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="w-28 text-left text-[10px] uppercase text-[#7A6A5C]">
              Giãn dòng
            </label>
            <InputNumber
              min={1}
              max={5}
              step={0.1}
              value={el.lineHeight}
              onChange={(e) => onUpdate(el.id, { lineHeight: Number(e.target.value) })}
              className="w-20! rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="w-28 text-left text-[10px] uppercase text-[#7A6A5C]">
              Căn dọc
            </label>
            <div className="flex gap-1">
              {[
                { value: "top" as const, icon: ArrowUpFromLine, label: "Trên" },
                { value: "middle" as const, icon: AlignCenter, label: "Giữa" },
                { value: "bottom" as const, icon: ArrowDownFromLine, label: "Dưới" },
              ].map(({ value, icon: Icon, label }) => (
                <FormatButton
                  key={value}
                  active={(el.verticalAlign || "middle") === value}
                  onClick={() => onUpdate(el.id, { verticalAlign: value })}
                  title={label}
                >
                  <Icon size={15} />
                </FormatButton>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Màu nền chữ</label>
            <ColorPickerRow
              value={el.backgroundColor}
              onChange={(v) => onUpdate(el.id, { backgroundColor: v })}
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Độ trong suốt</label>
            <div className="flex items-center gap-2">
              <Slider
                value={Math.round(el.opacity * 100)}
                onValueChange={(v) => onUpdate(el.id, { opacity: v / 100 })}
                min={0}
                max={100}
                className="flex-1"
              />
              <span className="w-8 text-right text-xs text-[#7A6A5C]">
                {Math.round(el.opacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Khoảng đệm">
        <div className="flex flex-col gap-4 py-2">
          <Select
            size="sm"
            value={paddingMode}
            options={PADDING_MODES.map((m) => ({ label: m.label, value: m.value }))}
            onValueChange={(val) => setPaddingMode(String(val))}
            className="border-[#D9CDBE]! bg-[#F3EDE3]! text-[#2D231F]!"
            wrapperClassName="w-full"
          />

          <div className="flex flex-col items-center justify-center mt-4">
            <div className="relative flex aspect-video w-full max-w-90 select-none items-center justify-center rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] p-8">
              <div className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/3" />
              <div className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-0.5">
                <InputNumber
                  min={0}
                  max={200}
                  value={el.paddingTop}
                  onChange={(e) => handlePaddingChange("top", Number(e.target.value))}
                  className="rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center font-mono text-[11px] text-[#2D231F] outline-none transition-all focus:border-[#2D231F]"
                  tooltip="Padding Trên"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col-reverse items-center gap-0.5">
                <InputNumber
                  min={0}
                  max={200}
                  value={el.paddingBottom}
                  onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))}
                  className="rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center font-mono text-[11px] text-[#2D231F] outline-none transition-all focus:border-[#2D231F]"
                  tooltip="Padding Dưới"
                />
              </div>
              <div className="absolute -left-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1">
                <InputNumber
                  min={0}
                  max={200}
                  value={el.paddingLeft}
                  onChange={(e) => handlePaddingChange("left", Number(e.target.value))}
                  className="rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center font-mono text-[11px] text-[#2D231F] outline-none transition-all focus:border-[#2D231F]!"
                  tooltip="Padding Trái"
                />
              </div>
              <div className="absolute -right-4 top-1/2 z-10 flex -translate-y-1/2 flex-row-reverse items-center gap-1">
                <InputNumber
                  min={0}
                  max={200}
                  value={el.paddingRight}
                  onChange={(e) => handlePaddingChange("right", Number(e.target.value))}
                  className="rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center font-mono text-[11px] text-[#2D231F] outline-none transition-all focus:border-[#2D231F]!"
                  tooltip="Padding Phải"
                />
              </div>
              <div className="pointer-events-none z-0 flex h-20 w-30 items-center justify-center rounded-md shadow-inner">
                <span className="text-[11px] font-medium tracking-wide text-[#7A6A5C]">VĂN BẢN</span>
              </div>
            </div>
          </div>

          {onAlignElement && (
            <div className="mt-2 flex flex-col gap-2">
              <label className="text-[10px] uppercase text-[#7A6A5C]">Căn lề khung</label>
              <div className="flex items-center justify-center gap-1">
                <FormatButton
                  active={el.frameAlignH === "left"}
                  onClick={() => onAlignElement(el.id, { h: "left" })}
                  title="Trái"
                >
                  <AlignLeft size={14} />
                </FormatButton>
                <FormatButton
                  active={el.frameAlignH === "center"}
                  onClick={() => onAlignElement(el.id, { h: "center" })}
                  title="Giữa ngang"
                >
                  <AlignCenter size={14} />
                </FormatButton>
                <FormatButton
                  active={el.frameAlignH === "right"}
                  onClick={() => onAlignElement(el.id, { h: "right" })}
                  title="Phải"
                >
                  <AlignRight size={14} />
                </FormatButton>
                <div className="mx-1 h-5 w-px bg-[#D9CDBE]" />
                <FormatButton
                  active={el.frameAlignV === "top"}
                  onClick={() => onAlignElement(el.id, { v: "top" })}
                  title="Trên"
                >
                  <ArrowUpFromLine size={14} />
                </FormatButton>
                <FormatButton
                  active={el.frameAlignV === "middle"}
                  onClick={() => onAlignElement(el.id, { v: "middle" })}
                  title="Giữa dọc"
                >
                  <AlignCenter size={14} />
                </FormatButton>
                <FormatButton
                  active={el.frameAlignV === "bottom"}
                  onClick={() => onAlignElement(el.id, { v: "bottom" })}
                  title="Dưới"
                >
                  <ArrowDownFromLine size={14} />
                </FormatButton>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Đường viền">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase text-[#7A6A5C]">Kích thước</label>
            <InputNumber
              min={0}
              max={50}
              value={el.borderWidth}
              onChange={(e) => onUpdate(el.id, { borderWidth: Number(e.target.value) })}
              className="w-20! rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Màu viền</label>
            <ColorPickerRow
              value={el.borderColor}
              onChange={(v) => onUpdate(el.id, { borderColor: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Kiểu viền</label>
              <Select
                size="sm"
                value={el.borderStyle}
                options={BORDER_STYLES.map((s) => ({ label: s.label, value: s.value }))}
                onValueChange={(val) => onUpdate(el.id, { borderStyle: val as EditorElement["borderStyle"] })}
                className="border-[#D9CDBE]! bg-[#F3EDE3]! text-center! text-xs! text-[#2D231F]!"
                wrapperClassName="w-full [&_button]:text-xs! [&_div]:text-xs!"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Vị trí</label>
              <Select
                size="sm"
                value={el.borderPosition}
                options={BORDER_POSITIONS.map((p) => ({ label: p.label, value: p.value }))}
                onValueChange={(val) => onUpdate(el.id, { borderPosition: val as EditorElement["borderPosition"] })}
                className="border-[#D9CDBE]! bg-[#F3EDE3]! text-center text-xs! text-[#2D231F]!"
                wrapperClassName="w-full [&_button]:text-xs! [&_div]:text-xs!"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Chọn góc bo</label>
            <Select
              size="sm"
              value={borderRadiusMode}
              options={BORDER_RADIUS_MODES.map((m) => ({ label: m.label, value: m.value }))}
              onValueChange={(val) => setBorderRadiusMode(String(val))}
              className="border-[#D9CDBE]! bg-[#F3EDE3]! text-center! text-xs! text-[#2D231F]!"
              wrapperClassName="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Bán kính bo góc</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: "borderRadiusTopLeft", label: "TL" },
                { key: "borderRadiusTopRight", label: "TR" },
                { key: "borderRadiusBottomLeft", label: "BL" },
                { key: "borderRadiusBottomRight", label: "BR" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-0.5 block text-center text-[8px] text-[#7A6A5C]">{label}</label>
                  <InputNumber
                    min={0}
                    max={100}
                    value={(el as unknown as Record<string, number>)[key]}
                    onChange={(e) => handleBorderRadiusChange(key, Number(e.target.value))}
                    className="rounded border border-[#D9CDBE] bg-[#F3EDE3] p-1.5! text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
                    wrapperClassName="w-full"
                    showButtons={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Đổ bóng">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Màu bóng</label>
            <ColorPickerRow
              value={el.shadowColor}
              onChange={(v) => onUpdate(el.id, { shadowColor: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="w-28 text-left text-[10px] uppercase text-[#7A6A5C]">Độ mờ</label>
            <InputNumber
              min={-5}
              max={20}
              value={el.shadowBlur}
              onChange={(e) => onUpdate(el.id, { shadowBlur: Number(e.target.value) })}
              className="w-20! rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="w-28 text-left text-[10px] uppercase text-[#7A6A5C]">Lệch X</label>
            <InputNumber
              min={-50}
              max={50}
              value={el.shadowOffsetX}
              onChange={(e) => onUpdate(el.id, { shadowOffsetX: Number(e.target.value) })}
              className="w-20! rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="w-28 text-left text-[10px] uppercase text-[#7A6A5C]">Lệch Y</label>
            <InputNumber
              min={-50}
              max={50}
              value={el.shadowOffsetY}
              onChange={(e) => onUpdate(el.id, { shadowOffsetY: Number(e.target.value) })}
              className="w-20! rounded border border-[#D9CDBE] bg-[#F3EDE3] text-center text-[10px]! text-[#2D231F] outline-none focus:border-[#2D231F]"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Liên kết">
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-[10px] uppercase text-[#7A6A5C]">
            <Link2 size={12} />
            URL liên kết
          </label>
          <input
            type="url"
            value={el.link}
            onChange={(e) => onUpdate(el.id, { link: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-[#D9CDBE] bg-[#F3EDE3] px-3 py-2 text-xs text-[#2D231F] outline-none placeholder:text-[#7A6A5C]/50 focus:border-[#2D231F]"
          />
          {el.link && (
            <a
              href={el.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-[10px] text-[#2D231F] hover:underline"
            >
              {el.link}
            </a>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Hiệu ứng chuyển động">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-[#7A6A5C]">
              <Play size={12} />
              Bật chuyển động
            </span>
            <Switch
              checked={el.motionEnabled}
              onChange={(v) => onUpdate(el.id, { motionEnabled: v })}
            />
          </div>
          {el.motionEnabled && (
            <>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                  Loại hiệu ứng
                </label>
                <Select
                  size="sm"
                  value={el.motionType}
                  options={MOTION_TYPES.map((m) => ({ label: m.label, value: m.value }))}
                  onValueChange={(val) => onUpdate(el.id, { motionType: String(val) })}
                  className="border-[#D9CDBE]! bg-[#F3EDE3]! text-xs! text-[#2D231F]!"
                  wrapperClassName="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                  Thời gian: {el.motionDuration}s
                </label>
                <Slider
                  value={el.motionDuration}
                  onValueChange={(v) => onUpdate(el.id, { motionDuration: v })}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                  Độ trễ: {el.motionDelay}s
                </label>
                <Slider
                  value={el.motionDelay}
                  onValueChange={(v) => onUpdate(el.id, { motionDelay: v })}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                  Kiểu chuyển động
                </label>
                <Select
                  size="sm"
                  value={el.motionEasing}
                  options={EASING_TYPES.map((e) => ({ label: e.label, value: e.value }))}
                  onValueChange={(val) => onUpdate(el.id, { motionEasing: String(val) })}
                  className="border-[#D9CDBE]! bg-[#F3EDE3]! text-xs! text-[#2D231F]!"
                  wrapperClassName="w-full"
                />
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Chuyển động liên tục">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-[#7A6A5C]">
              <Repeat size={12} />
              Bật chuyển động
            </span>
            <Switch
              checked={el.continuousMotionEnabled}
              onChange={(v) => onUpdate(el.id, { continuousMotionEnabled: v })}
            />
          </div>
          {el.continuousMotionEnabled && (
            <>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                  Loại chuyển động
                </label>
                <Select
                  size="sm"
                  value={el.continuousMotionType}
                  options={CONTINUOUS_MOTION_TYPES.map((m) => ({ label: m.label, value: m.value }))}
                  onValueChange={(val) => onUpdate(el.id, { continuousMotionType: String(val) })}
                  className="border-[#D9CDBE]! bg-[#F3EDE3]! text-xs! text-[#2D231F]!"
                  wrapperClassName="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                    Thời gian (s)
                  </label>
                  <InputNumber
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={el.continuousMotionDuration}
                    onChange={(e) =>
                      onUpdate(el.id, { continuousMotionDuration: Number(e.target.value) })
                    }
                    className="text-xs"
                    wrapperClassName="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">Độ trễ (s)</label>
                  <InputNumber
                    min={0}
                    max={10}
                    step={0.1}
                    value={el.continuousMotionDelay}
                    onChange={(e) =>
                      onUpdate(el.id, { continuousMotionDelay: Number(e.target.value) })
                    }
                    className="text-xs"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      <button
        type="button"
        onClick={() => onDelete(el.id)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-400/30 py-2 text-xs text-red-500 transition-colors hover:bg-red-400/10"
      >
        <Trash2 size={12} />
        Xóa văn bản
      </button>
    </div>
  );
}
