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
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpFromLine,
  Bold,
  CaseLower,
  CaseUpper,
  Italic,
  Link2,
  Minus,
  Move,
  Play,
  Plus,
  Repeat,
  Square,
  Strikethrough,
  Sun,
  Trash2,
  Type,
  Underline,
} from "lucide-react";
import { useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import FormatButton from "../components/FormatButton";
import SectionHeader from "../components/SectionHeader";
import type { EditorElement } from "../types";
import {
  BORDER_POSITIONS,
  BORDER_RADIUS_MODES,
  BORDER_STYLES,
  CONTINUOUS_MOTION_TYPES,
  EASING_TYPES,
  FONTS,
  FONT_SIZES,
  MOTION_TYPES,
  PADDING_MODES,
} from "../utils/constants";

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
  onAddText: () => void;
  elements?: EditorElement[];
  onSelect?: (id: string) => void;
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

  const textElements = elements.filter((e) => e.type === "text");

  if (!el) {
    return (
      <div className="space-y-4">
        {textElements.length > 0 && (
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase block mb-2">
              Danh sách văn bản
            </label>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {textElements.map((textEl) => (
                <Button
                  key={textEl.id}
                  onClick={() => onSelect?.(textEl.id)}
                  className="w-full! text-left! px-3! py-2.5! bg-[#333]! text-white! text-xs rounded-lg border border-[#444] hover:border-[#d4af37] transition-colors truncate"
                  label={textEl.content}
                  variant="outline"
                >
                  {textEl.content || "Văn bản trống"}
                </Button>
              ))}
            </div>
          </div>
        )}
        <p className="text-gray-500 text-xs text-center py-2">
          {textElements.length === 0
            ? "Chưa có văn bản nào"
            : "Chọn văn bản để chỉnh sửa hoặc thêm mới"}
        </p>
        <Button
          onClick={onAddText}
          variant="outline"
          className="w-full! py-2.5! bg-[#d4af37]/20! text-[#d4af37]! text-sm rounded-lg hover:bg-[#d4af37]/30 transition-colors font-medium"
          leftIcon={<Plus size={14} />}
        >
          Thêm văn bản
        </Button>
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

  return (
    <div
      onKeyDown={(e) => e.stopPropagation()}
      className="space-y-4"
    >
      <InputTextarea
        value={el.content}
        onChange={(e) => onUpdate(el.id, { content: e.target.value })}
        className="bg-[#333]! text-xs! text-white! border-[#444]! px-3 py-2 min-h-20"
        placeholder="Nhập nội dung..."
      />

      <SectionHeader icon={<Type size={14} />} title="Kiểu chữ" />
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-1">
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
            <div className="h-5 w-px bg-[#444] mx-1" />
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
          </div>
          <div className="flex flex-col items-stretch mt-2 ml-auto w-full max-w-70">
            <div className="flex items-center justify-between mt-2">
              <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
                Dãn khoảng cách chữ
              </label>
              <InputNumber
                min={-5}
                max={20}
                value={el.letterSpacing}
                onChange={(e) => onUpdate(el.id, { letterSpacing: Number(e.target.value) })}
                className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
                Dãn khoảng cách dòng
              </label>
              <InputNumber
                min={1.5}
                max={5}
                step={0.5}
                value={el.lineHeight}
                onChange={(e) => onUpdate(el.id, { lineHeight: Number(e.target.value) })}
                className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
            Căn lề ngang
          </label>
          <div className="flex gap-1">
            {[
              { value: "left" as const, icon: AlignLeft, label: "Bắt đầu dòng" },
              { value: "center" as const, icon: AlignCenter, label: "Căn giữa" },
              { value: "right" as const, icon: AlignRight, label: "Cuối dòng" },
              { value: "justify" as const, icon: AlignJustify, label: "Hiển thị full width" },
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
        </div>
        <div className="flex items-center justify-between mt-2">
          <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
            Căn lề dọc
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
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Cỡ chữ</label>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => {
                const currentSize = el.fontSize || 14;
                const idx = FONT_SIZES.indexOf(currentSize);
                if (idx > 0) onUpdate(el.id, { fontSize: FONT_SIZES[idx - 1] });
              }}
              variant="outline"
              className="w-9! h-9! flex items-center justify-center bg-[#333]! rounded-lg! border! border-[#444]! text-gray-300! hover:bg-[#444]! hover:text-white! shrink-0"
              leftIcon={<Minus size={14} />}
            />

            <Select
              size="sm"
              options={fontSizeOptions}
              value={el.fontSize}
              defaultValue={14}
              onValueChange={(val) => onUpdate(el.id, { fontSize: Number(val) })}
              className="bg-[#333]! text-white! border-[#444]! text-center"
              wrapperClassName="flex-1"
            />

            <Button
              onClick={() => {
                const currentSize = el.fontSize || 14;
                const idx = FONT_SIZES.indexOf(currentSize);
                if (idx < FONT_SIZES.length - 1) onUpdate(el.id, { fontSize: FONT_SIZES[idx + 1] });
              }}
              variant="outline"
              className="w-9! h-9! flex items-center justify-center bg-[#333]! rounded-lg! border! border-[#444]! text-gray-300! hover:bg-[#444]! hover:text-white! shrink-0"
              leftIcon={<Plus size={14} />}
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Font chữ</label>
          <Select
            size="sm"
            value={el.fontFamily}
            options={FONTS.map((f) => ({ label: f, value: f }))}
            onValueChange={(val) => onUpdate(el.id, { fontFamily: String(val) })}
            className="bg-[#333]! text-white! border-[#444]!"
            wrapperClassName="w-full"
          />
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Màu chữ</label>
            <ColorPickerRow
              value={el.color}
              onChange={(v) => onUpdate(el.id, { color: v, fill: v })}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Màu nền chữ</label>
            <ColorPickerRow
              value={el.backgroundColor}
              onChange={(v) => onUpdate(el.id, { backgroundColor: v })}
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Độ trong suốt</label>
          <div className="flex items-center gap-2">
            <Slider
              value={Math.round(el.opacity * 100)}
              onValueChange={(v) => onUpdate(el.id, { opacity: v / 100 })}
              min={0}
              max={100}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-8 text-right">
              {Math.round(el.opacity * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#333]" />

      <SectionHeader icon={<Move size={14} />} title="Khoảng đệm" />
      <div className="flex flex-col gap-4 py-2">
        <Select
          size="sm"
          value={paddingMode}
          options={PADDING_MODES.map((m) => ({ label: m.label, value: m.value }))}
          onValueChange={(val) => setPaddingMode(String(val))}
          className="bg-[#333]! text-white! border-[#444]!"
          wrapperClassName="w-full"
        />

        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-full max-w-90 aspect-video bg-[#222] border border-[#444] rounded-xl p-8 relative flex items-center justify-center group select-none">
            <div className="absolute inset-2 border border-dashed border-emerald-500/30 bg-emerald-500/3 rounded-lg pointer-events-none" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-10">
              <InputNumber
                min={0}
                max={200}
                value={el.paddingTop}
                onChange={(e) => handlePaddingChange("top", Number(e.target.value))}
                className="bg-[#2a2a2a] text-white text-[11px] font-mono border border-[#444] focus:border-[#d4af37] rounded  text-center transition-all outline-none "
                tooltip="Padding Trên"
              />

            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-0.5 z-10">
              <InputNumber
                min={0}
                max={200}
                value={el.paddingBottom}
                onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))}
                className="bg-[#2a2a2a] text-white text-[11px] font-mono border border-[#444] focus:border-[#d4af37] rounded  text-center transition-all outline-none "
                tooltip="Padding Dưới"
              />

            </div>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
              <InputNumber
                min={0}
                max={200}
                value={el.paddingLeft}
                onChange={(e) => handlePaddingChange("left", Number(e.target.value))}
                className="bg-[#2a2a2a] text-white text-[11px] font-mono border border-[#444] focus:border-[#d4af37]! rounded  text-center transition-all outline-none "
                tooltip="Padding Trái"
              />

            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-1 z-10">
              <InputNumber
                min={0}
                max={200}
                value={el.paddingRight}
                onChange={(e) => handlePaddingChange("right", Number(e.target.value))}
                className="bg-[#2a2a2a] text-white text-[11px] font-mono border border-[#444] focus:border-[#d4af37]! rounded text-center transition-all outline-none "
                tooltip="Padding Phải"
              />

            </div>

            <div className="w-30 h-20 rounded-md flex items-center justify-center shadow-inner z-0 pointer-events-none">
              <span className="text-gray-400 text-[11px] font-medium tracking-wide">VĂN BẢN</span>
            </div>
          </div>
        </div>

        {onAlignElement && el && (
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] text-gray-500 uppercase">Căn lề khung</label>
            <div className="flex items-center gap-1 justify-center">
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
              <div className="w-px h-5 bg-[#333] mx-1" />
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

      <div className="h-px bg-[#333]" />

      <SectionHeader icon={<Square size={14} />} title="Đường viền" />

      <div className="space-y-3">
        <div className="flex flex-col items-stretch mt-2 ml-auto w-full max-w-70">
          <div className="flex items-center justify-between mt-2">
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Kích thước</label>
            <InputNumber
              min={0}
              max={50}
              value={el.borderWidth}
              onChange={(e) => onUpdate(el.id, { borderWidth: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>
        </div>
        <div className="flex flex-col items-stretch mt-2 ml-auto w-full max-w-70">
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Màu viền</label>
          <ColorPickerRow
            value={el.borderColor}
            onChange={(v) => onUpdate(el.id, { borderColor: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Kiểu viền</label>
            <Select
              size="sm"
              value={el.borderStyle}
              options={BORDER_STYLES.map((s) => ({ label: s.label, value: s.value }))}
              onValueChange={(val) => onUpdate(el.id, { borderStyle: val as any })}
              className="bg-[#333]! text-white! border-[#444]! text-center! text-xs!"
              wrapperClassName="w-full [&_button]:text-xs! [&_div]:text-xs!"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Vị trí</label>
            <Select
              size="sm"
              value={el.borderPosition}
              options={BORDER_POSITIONS.map((p) => ({ label: p.label, value: p.value }))}
              onValueChange={(val) => onUpdate(el.id, { borderPosition: val as any })}
              className="bg-[#333]! text-white! border-[#444]! text-center text-xs!"
              wrapperClassName="w-full [&_button]:text-xs! [&_div]:text-xs!"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Chọn góc bo</label>
          <Select
            size="sm"
            value={borderRadiusMode}
            options={BORDER_RADIUS_MODES.map((m) => ({ label: m.label, value: m.value }))}
            onValueChange={(val) => setBorderRadiusMode(String(val))}
            className="bg-[#333]! text-white! border-[#444]! text-center! text-xs!"
            wrapperClassName="w-full"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Bán kính bo góc</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { key: "borderRadiusTopLeft", label: "TL" },
              { key: "borderRadiusTopRight", label: "TR" },
              { key: "borderRadiusBottomLeft", label: "BL" },
              { key: "borderRadiusBottomRight", label: "BR" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-[8px] text-gray-500 block text-center mb-0.5">{label}</label>
                <InputNumber
                  min={0}
                  max={100}
                  value={(el as any)[key]}
                  onChange={(e) => handleBorderRadiusChange(key, Number(e.target.value))}
                  className="text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center p-1.5!"
                  wrapperClassName="w-full"
                  showButtons={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-[#333]" />

      <SectionHeader icon={<Sun size={14} />} title="Đổ bóng" />
      <div className="space-y-3">
        <div className="flex flex-col items-stretch mt-2 ml-auto w-full max-w-70">
          <label className="text-[10px] text-gray-500 uppercase block mb-1">Màu bóng</label>
          <ColorPickerRow
            value={el.shadowColor}
            onChange={(v) => onUpdate(el.id, { shadowColor: v })}
          />
        </div>
        <div className="flex flex-col items-stretch mt-2 ml-auto w-full max-w-70">
          <div className="flex items-center justify-between mt-2">
            <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
              Độ mờ
            </label>
            <InputNumber
              min={-5}
              max={20}
              value={el.shadowBlur}
              onChange={(e) => onUpdate(el.id, { shadowBlur: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
              Lệch X
            </label>
            <InputNumber
              min={-50}
              max={50}
              value={el.shadowOffsetX}
              onChange={(e) => onUpdate(el.id, { shadowOffsetX: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
              Lệch X
            </label>
            <InputNumber
              min={-50}
              max={50}
              value={el.shadowOffsetY}
              onChange={(e) => onUpdate(el.id, { shadowOffsetY: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-[#333]" />

      <SectionHeader icon={<Link2 size={14} />} title="Liên kết" />
      <div className="space-y-2">
        <label className="text-[10px] text-gray-500 uppercase block">URL liên kết</label>
        <input
          type="url"
          value={el.link}
          onChange={(e) => onUpdate(el.id, { link: e.target.value })}
          placeholder="https://..."
          className="w-full bg-[#333] text-white text-xs border border-[#444] rounded-lg px-3 py-2 outline-none focus:border-[#d4af37] placeholder:text-gray-600"
        />
        {el.link && (
          <a
            href={el.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#d4af37] hover:underline block truncate"
          >
            {el.link}
          </a>
        )}
      </div>

      <div className="h-px bg-[#333]" />

      <SectionHeader icon={<Play size={14} />} title="Hiệu ứng chuyển động" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Bật chuyển động</span>
          <Switch
            checked={el.motionEnabled}
            onChange={(v) => onUpdate(el.id, { motionEnabled: v })}
          />
        </div>
        {el.motionEnabled && (
          <>
            <div>
              <label className="text-[10px] text-gray-500 uppercase block mb-1">
                Loại hiệu ứng
              </label>
              <Select
                size="sm"
                value={el.motionType}
                options={MOTION_TYPES.map((m) => ({ label: m.label, value: m.value }))}
                onValueChange={(val) => onUpdate(el.id, { motionType: String(val) })}
                className="bg-[#333]! text-white! border-[#444]! text-xs!"
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase block mb-1">
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
              <label className="text-[10px] text-gray-500 uppercase block mb-1">
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
              <label className="text-[10px] text-gray-500 uppercase block mb-1">
                Kiểu chuyển động
              </label>
              <Select
                size="sm"
                value={el.motionEasing}
                options={EASING_TYPES.map((e) => ({ label: e.label, value: e.value }))}
                onValueChange={(val) => onUpdate(el.id, { motionEasing: String(val) })}
                className="bg-[#333]! text-white! border-[#444]! text-xs!"
                wrapperClassName="w-full"
              />
            </div>
          </>
        )}
      </div>

      <div className="h-px bg-[#333]" />

      <SectionHeader icon={<Repeat size={14} />} title="Chuyển động liên tục" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Bật chuyển động</span>
          <Switch
            checked={el.continuousMotionEnabled}
            onChange={(v) => onUpdate(el.id, { continuousMotionEnabled: v })}
          />
        </div>
        {el.continuousMotionEnabled && (
          <>
            <div>
              <label className="text-[10px] text-gray-500 uppercase block mb-1">
                Loại chuyển động
              </label>
              <Select
                size="sm"
                value={el.continuousMotionType}
                options={CONTINUOUS_MOTION_TYPES.map((m) => ({ label: m.label, value: m.value }))}
                onValueChange={(val) => onUpdate(el.id, { continuousMotionType: String(val) })}
                className="bg-[#333]! text-white! border-[#444]! text-xs!"
                wrapperClassName="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 uppercase block mb-1">
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
                <label className="text-[10px] text-gray-500 uppercase block mb-1">Độ trễ (s)</label>
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

      <button
        onClick={() => onDelete(el.id)}
        className="w-full py-2 text-xs text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors flex items-center justify-center gap-1.5"
      >
        <Trash2 size={12} />
        Xóa văn bản
      </button>
    </div>
  );
}
