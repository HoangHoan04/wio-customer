import Input from "@/templates/customer-design/ui/input/Input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { EditorElement } from "../types";
import {
  centerPresetOnCanvas,
  DESIGN_PRESETS,
  PRESET_CATEGORIES,
  type DesignPreset,
  type PresetCategory,
  type PresetTemplateEl,
} from "../utils/design-presets";

function PresetPreview({ elements }: { elements: PresetTemplateEl[] }) {
  const minX = Math.min(...elements.map((e) => e.x));
  const minY = Math.min(...elements.map((e) => e.y));
  const maxX = Math.max(...elements.map((e) => e.x + e.width));
  const maxY = Math.max(...elements.map((e) => e.y + e.height));
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  const scale = Math.min(128 / w, 64 / h);

  return (
    <div className="flex h-20 items-center justify-center overflow-hidden bg-[#EDE4D5]">
      <div
        className="relative shrink-0"
        style={{
          width: w,
          height: h,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {elements.map((el, i) => {
          if (el.type === "text") {
            return (
              <div
                key={i}
                className="absolute flex items-center justify-center overflow-hidden"
                style={{
                  left: el.x - minX,
                  top: el.y - minY,
                  width: el.width,
                  height: el.height,
                  color: el.color,
                  fontFamily: el.fontFamily,
                  fontSize: el.fontSize,
                  fontWeight: el.fontWeight,
                  fontStyle: el.fontStyle,
                  letterSpacing: el.letterSpacing,
                  textTransform: el.textTransform,
                  lineHeight: 1,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {el.content}
              </div>
            );
          }
          if (el.type === "shape") {
            const common: React.CSSProperties = {
              position: "absolute",
              left: el.x - minX,
              top: el.y - minY,
              width: el.width,
              height: el.height,
              backgroundColor: el.fill === "transparent" ? "transparent" : el.fill,
              border:
                el.stroke && el.stroke !== "transparent" && (el.strokeWidth || 0) > 0
                  ? `${el.strokeWidth}px solid ${el.stroke}`
                  : undefined,
              opacity: el.opacity,
              boxSizing: "border-box",
            };
            if (el.shapeType === "circle") common.borderRadius = "50%";
            if (el.shapeType === "heart") {
              return (
                <div
                  key={i}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: el.x - minX,
                    top: el.y - minY,
                    width: el.width,
                    height: el.height,
                    color: el.fill,
                    fontSize: Math.min(el.width, el.height),
                    lineHeight: 1,
                  }}
                >
                  ♥
                </div>
              );
            }
            if (el.shapeType === "star") {
              return (
                <div
                  key={i}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: el.x - minX,
                    top: el.y - minY,
                    width: el.width,
                    height: el.height,
                    color: el.fill,
                    fontSize: Math.min(el.width, el.height) * 0.9,
                    lineHeight: 1,
                  }}
                >
                  ★
                </div>
              );
            }
            return <div key={i} style={common} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default function PresetPanelContent({
  onAddElements,
}: {
  onAddElements: (els: Omit<EditorElement, "id" | "zIndex">[], grouped: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PresetCategory | "all">("all");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESIGN_PRESETS.filter((preset) => {
      if (category !== "all" && preset.category !== category) return false;
      if (!q) return true;
      return (
        preset.title.toLowerCase().includes(q) ||
        preset.keywords.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const insert = (preset: DesignPreset) => {
    onAddElements(centerPresetOnCanvas(preset.elements), preset.grouped);
  };

  return (
    <div className="space-y-4 pb-8">
      <p className="text-[11px] leading-relaxed text-[#7A6A5C]">
        Chọn mẫu chữ, cụm thiết kế hoặc khung có sẵn — bấm để chèn ngay lên thiệp.
      </p>

      <Input
        type="text"
        inputSize="sm"
        placeholder="Tìm preset..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Search size={14} />}
        className="bg-[#F3EDE3]! text-[#2D231F]!"
      />

      <div className="flex flex-wrap gap-1">
        {PRESET_CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
              category === tab.id
                ? "bg-[#2D231F] text-[#F3EDE3]"
                : "bg-[#EDE4D5] text-[#7A6A5C] hover:text-[#2D231F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-[11px] text-[#7A6A5C]">Không tìm thấy preset phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => insert(preset)}
              className="overflow-hidden rounded-xl border border-[#D9CDBE] bg-[#F3EDE3] text-left transition-colors hover:border-[#2D231F] hover:bg-[#EDE4D5]"
            >
              <PresetPreview elements={preset.elements} />
              <div className="px-2.5 py-2">
                <div className="truncate text-[11px] font-semibold text-[#2D231F]">{preset.title}</div>
                <div className="mt-0.5 text-[10px] text-[#7A6A5C]">
                  {preset.category === "text"
                    ? "Chữ mẫu"
                    : preset.category === "combo"
                      ? "Cụm thiết kế"
                      : preset.category === "frame"
                        ? "Khung"
                        : "Nhãn"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
