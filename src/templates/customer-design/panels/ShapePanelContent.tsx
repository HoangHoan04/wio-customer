import ColorPickerRow from "@/templates/customer-design/components/ColorPickerRow";
import InputNumber from "@/templates/customer-design/ui/input/InputNumber";
import Select from "@/templates/customer-design/ui/Select";
import Slider from "@/templates/customer-design/ui/Slider";
import Switch from "@/templates/customer-design/ui/Switch";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Section from "../components/Section";
import type { EditorElement } from "../types";
import { BORDER_RADIUS_MODES, SHAPE_LABELS, WEDDING_SHAPES } from "../utils/constants";

export default function ShapePanelContent({
  elements = [],
  selectedElement,
  onUpdate,
  onDelete,
  onAddShape,
  onSelect,
}: {
  elements?: EditorElement[];
  selectedElement: EditorElement | null;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  onDelete: (id: string) => void;
  onAddShape: (type: string) => void;
  onSelect?: (id: string | null) => void;
}) {
  const [panelView, setPanelView] = useState<"list" | "detail">("list");
  const [borderRadiusMode, setBorderRadiusMode] = useState("all");

  const shapes = elements.filter((el) => el.type === "shape");
  const el = selectedElement?.type === "shape" ? selectedElement : null;

  useEffect(() => {
    if (el) {
      setPanelView("detail");
    } else {
      setPanelView("list");
    }
  }, [el?.id]);

  if (panelView === "detail" && el) {
    const update = (updates: Partial<EditorElement>) => onUpdate(el.id, updates);

    return (
      <div className="w-full font-sans text-[#2D231F] pb-10 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPanelView("list");
              onSelect?.(null);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#EDE4D5] hover:bg-zinc-700 text-[#7A6A5C] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Chi tiết hình khối</h3>
            <p className="text-[11px] text-[#7A6A5C]/70 mt-0.5">
              {el.shapeType
                ? SHAPE_LABELS[el.shapeType] +
                  " " +
                  WEDDING_SHAPES.find((s) => s.type === el.shapeType)?.name
                : "Hình khối"}
            </p>
          </div>
        </div>

        <div className="h-px bg-[#EDE4D5]" />

        <Section label="Kích thước">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold mb-1 block">
                Chiều rộng
              </label>
              <InputNumber
                value={el.width}
                onValueChange={(v) => update({ width: v ?? 10 })}
                min={10}
                max={2000}
                className="w-full h-8 bg-[#F3EDE3] border-[#D9CDBE] text-xs text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold mb-1 block">
                Chiều cao
              </label>
              <InputNumber
                value={el.height}
                onValueChange={(v) => update({ height: v ?? 10 })}
                min={10}
                max={2000}
                className="w-full h-8 bg-[#F3EDE3] border-[#D9CDBE] text-xs text-center"
              />
            </div>
          </div>
        </Section>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold">Màu nền</label>
          <ColorPickerRow value={el.fill} onChange={(v) => update({ fill: v })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold">Màu viền</label>
          <ColorPickerRow
            value={el.stroke || "transparent"}
            onChange={(v) => update({ stroke: v })}
          />
        </div>

        <Section label="Độ dày viền">
          <Slider
            value={el.strokeWidth || 0}
            onValueChange={(v) => update({ strokeWidth: v })}
            min={0}
            max={50}
            className="mt-2"
          />
        </Section>

        <Section label="Độ mờ">
          <Slider
            value={el.opacity * 100}
            onValueChange={(v) => update({ opacity: v / 100 })}
            min={0}
            max={100}
            className="mt-2"
          />
        </Section>

        {el.shapeType === "rect" || el.shapeType === "square" ? (
          <Section label="Bo góc">
            <Select
              options={BORDER_RADIUS_MODES}
              value={borderRadiusMode}
              onValueChange={(v) => setBorderRadiusMode(String(v))}
              className="mb-3"
            />
            {borderRadiusMode === "all" ? (
              <div className="flex items-center gap-3">
                <Slider
                  value={el.borderRadiusTopLeft ?? 0}
                  onValueChange={(val) => {
                    update({
                      borderRadiusTopLeft: val,
                      borderRadiusTopRight: val,
                      borderRadiusBottomRight: val,
                      borderRadiusBottomLeft: val,
                    });
                  }}
                  min={0}
                  max={Math.min(el.width, el.height) / 2}
                  className="flex-1"
                />
                <span className="text-xs text-[#7A6A5C] w-8 text-right font-mono">
                  {el.borderRadiusTopLeft ?? 0}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "borderRadiusTopLeft", label: "Góc trên trái" },
                  { id: "borderRadiusTopRight", label: "Góc trên phải" },
                  { id: "borderRadiusBottomRight", label: "Góc dưới phải" },
                  { id: "borderRadiusBottomLeft", label: "Góc dưới trái" },
                ].map((corner) => (
                  <div
                    key={corner.id}
                    className="flex flex-col gap-1.5 bg-[#F3EDE3]/50 p-2 rounded-lg border border-[#D9CDBE]/50"
                  >
                    <label className="text-[10px] text-[#7A6A5C]/70 truncate">{corner.label}</label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={(el as any)[corner.id] ?? 0}
                        onValueChange={(val) => update({ [corner.id]: val })}
                        min={0}
                        max={Math.min(el.width, el.height) / 2}
                        className="flex-1"
                      />
                      <span className="text-xs text-[#7A6A5C] w-6 text-right font-mono">
                        {(el as any)[corner.id] ?? 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        ) : null}

        <Section label="Đổ bóng">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7A6A5C]">Bật bóng đổ</span>
              <Switch
                checked={el.shadowBlur > 0}
                onChange={(val) => {
                  if (val) {
                    update({
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowOffsetY: 4,
                      shadowColor: "#000000",
                    });
                  } else {
                    update({ shadowBlur: 0 });
                  }
                }}
              />
            </div>

            {el.shadowBlur > 0 && (
              <>
                <div className="flex flex-col gap-1.5 mb-3">
                  <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold">
                    Màu bóng
                  </label>
                  <ColorPickerRow
                    value={el.shadowColor}
                    onChange={(v) => update({ shadowColor: v })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-[#7A6A5C]/70">Độ mờ bóng (Blur)</label>
                    <span className="text-xs text-[#7A6A5C] font-mono">{el.shadowBlur}</span>
                  </div>
                  <Slider
                    value={el.shadowBlur}
                    onValueChange={(v) => update({ shadowBlur: v })}
                    min={0}
                    max={50}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold mb-1 block">
                      Khoảng cách X
                    </label>
                    <InputNumber
                      value={el.shadowOffsetX}
                      onValueChange={(v) => update({ shadowOffsetX: v ?? 0 })}
                      min={-50}
                      max={50}
                      className="w-full h-8 bg-[#F3EDE3] border-[#D9CDBE] text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#7A6A5C]/70 uppercase font-semibold mb-1 block">
                      Khoảng cách Y
                    </label>
                    <InputNumber
                      value={el.shadowOffsetY}
                      onValueChange={(v) => update({ shadowOffsetY: v ?? 0 })}
                      min={-50}
                      max={50}
                      className="w-full h-8 bg-[#F3EDE3] border-[#D9CDBE] text-xs text-center"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Section>

        <div className="h-px bg-[#EDE4D5] mt-4" />

        <button
          onClick={() => {
            onDelete(el.id);
            setPanelView("list");
          }}
          className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors py-2"
        >
          <Trash2 size={13} />
          Xoá hình khối
        </button>
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-[#2D231F]">
      <Section label="Thêm hình">
        <div className="grid grid-cols-4 gap-2">
          {WEDDING_SHAPES.map((shape) => (
            <button
              key={shape.type}
              onClick={() => onAddShape(shape.type)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#F3EDE3]/60 rounded-xl border border-[#D9CDBE] hover:border-amber-500/50 hover:bg-[#EDE4D5] transition-all duration-200 group"
            >
              <span className="text-2xl text-[#7A6A5C] group-hover:text-amber-400 group-hover:scale-110 transition-all">
                {SHAPE_LABELS[shape.type]}
              </span>
              <span className="text-[9px] text-[#7A6A5C]/70 group-hover:text-zinc-300 font-medium">
                {shape.name}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {shapes.length > 0 && (
        <div className="mt-6 border-t border-[#D9CDBE] pt-5">
          <h3 className="text-xs font-bold text-zinc-300 tracking-wide mb-3 uppercase">
            Danh sách hình trên Canvas
          </h3>
          <div className="space-y-2">
            {shapes.map((s, index) => (
              <div
                key={s.id}
                onClick={() => onSelect?.(s.id)}
                className="flex items-center justify-between p-2.5 bg-[#F3EDE3]/40 border border-[#D9CDBE]/80 rounded-lg hover:border-amber-500/30 hover:bg-[#EDE4D5]/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#EDE4D5] flex items-center justify-center border border-zinc-700/50">
                    <span className="text-lg text-zinc-300">{SHAPE_LABELS[s.shapeType]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200 group-hover:text-amber-400 transition-colors">
                      Hình {index + 1} ({WEDDING_SHAPES.find((ws) => ws.type === s.shapeType)?.name}
                      )
                    </p>
                    <p className="text-[10px] text-[#7A6A5C]/70 mt-0.5">
                      {Math.round(s.width)} x {Math.round(s.height)} px
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[#7A6A5C]/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
