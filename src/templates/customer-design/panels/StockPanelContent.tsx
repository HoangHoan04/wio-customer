import ColorPickerRow from "@/templates/customer-design/components/ColorPickerRow";
import SectionHeader from "@/templates/customer-design/components/SectionHeader";
import type { EditorElement } from "@/templates/customer-design/types";
import InputNumber from "@/templates/customer-design/ui/input/InputNumber";
import Select from "@/templates/customer-design/ui/Select";
import Slider from "@/templates/customer-design/ui/Slider";
import Switch from "@/templates/customer-design/ui/Switch";
import { BORDER_RADIUS_MODES } from "@/templates/customer-design/utils/constants";
import {
  fitImageToCanvas,
  loadImageSize,
} from "@/templates/customer-design/utils/image-fit";
import {
  ArrowLeft,
  CloudUpload,
  Smile,
  Square,
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface StockPanelContentProps {
  onAddImageToCanvas: (
    url: string,
    settings?: {
      width?: number;
      height?: number;
      opacity?: number;
      borderRadius?: number;
      shadowBlur?: number;
      shadowColor?: string;
    },
  ) => void;
  selectedCanvasImageUrl?: string | null;
  onDeselect?: () => void;
  selectedElement?: EditorElement | null;
  onUpdateElement?: (id: string, updates: Partial<EditorElement>) => void;
  elements?: EditorElement[];
  onDeleteElement?: (id: string) => void;
  onDeleteElements?: (ids: string[]) => void;
  canvasWidth?: number;
}

type Tab = "sticker" | "emoji";

const EMOJI_CATEGORIES = [
  {
    name: "Trái tim",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💕",
      "💗",
      "💖",
      "💘",
      "💝",
      "❣️",
    ],
  },
  {
    name: "Tình yêu",
    emojis: ["💑", "💏", "💌", "💋", "🥰", "😍", "😘", "😚", "😊", "🤗"],
  },
  {
    name: "Cưới hỏi",
    emojis: ["💍", "👰", "🤵", "💒", "🎎", "🧧", "🎊", "🥂", "🍾", "💐"],
  },
  {
    name: "Hoa lá",
    emojis: ["🌹", "🌸", "🌺", "🌻", "🌷", "🌼", "💐", "🌿", "🌱", "🌾"],
  },
  {
    name: "Sao & Phép",
    emojis: ["⭐", "✨", "🌟", "💫", "⭐", "🌟", "✨", "🪄"],
  },
  {
    name: "Thiên nhiên",
    emojis: ["🕊️", "🦋", "🌈", "🌙", "🌞", "☀️", "🌊", "🌸"],
  },
  {
    name: "Tiệc & Quà",
    emojis: ["🎉", "🎊", "🥂", "🍾", "🎁", "🎀", "🎈", "🎶", "🎵"],
  },
];

function emojiToTwemojiUrl(emoji: string): string {
  const codePoints = Array.from(emoji).map((c) =>
    c.codePointAt(0)!.toString(16),
  );
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${codePoints.join("-")}.png`;
}

export default function StockPanelContent({
  onAddImageToCanvas,
  selectedCanvasImageUrl,
  onDeselect,
  selectedElement,
  onUpdateElement,
  elements: _elements,
  onDeleteElement,
  onDeleteElements: _onDeleteElements,
  canvasWidth = 440,
}: StockPanelContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("sticker");
  const [panelView, setPanelView] = useState<"list" | "detail">("list");
  const [selectedItem, setSelectedItem] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [borderRadiusMode, setBorderRadiusMode] = useState("all");

  const editingEl = useMemo(
    () => (selectedElement?.type === "image" ? selectedElement : null),
    [selectedElement],
  );

  useEffect(() => {
    if (selectedCanvasImageUrl && panelView === "list") {
      setSelectedItem({ url: selectedCanvasImageUrl, title: "" });
      setPanelView("detail");
    }
  }, [selectedCanvasImageUrl, panelView]);

  useEffect(() => {
    if (!selectedCanvasImageUrl && panelView === "detail" && !selectedItem) {
      setPanelView("list");
      setSelectedItem(null);
    }
  }, [selectedCanvasImageUrl, panelView, selectedItem]);

  const handleAddToCanvas = async (url: string, title: string) => {
    setSelectedItem({ url, title });
    setPanelView("detail");

    const nat = await loadImageSize(url);
    const { width: w, height: h } = fitImageToCanvas(
      nat.width,
      nat.height,
      Math.min(canvasWidth, 300),
    );

    onAddImageToCanvas(url, { width: w, height: h });
  };
  const update = (updates: Partial<EditorElement>) => {
    if (editingEl && onUpdateElement) {
      onUpdateElement(editingEl.id, updates);
    }
  };

  const handleBackToList = () => {
    setPanelView("list");
    setSelectedItem(null);
    onDeselect?.();
  };

  const getBorderRadiusCorners = (
    mode: string,
    changedCorner: string,
  ): string[] => {
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
    update(updates as Partial<EditorElement>);
  };

  const handleRemove = () => {
    if (editingEl && onDeleteElement) {
      onDeleteElement(editingEl.id);
    }
    handleBackToList();
  };

  if (panelView === "detail") {
    const currentSrc = editingEl?.src ?? selectedItem?.url ?? "";

    if (!currentSrc) {
      return (
        <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
          Đang tải...
        </div>
      );
    }

    return (
      <div className="w-full font-sans text-zinc-100 space-y-4 pb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Quay lại danh sách
        </button>

        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center w-full">
          <img
            src={currentSrc}
            alt={selectedItem?.title || "Sticker"}
            className="w-full h-44 object-contain"
          />
        </div>

        {selectedItem && (
          <p className="text-[10px] text-zinc-600 truncate -mt-2">
            {selectedItem.title || "Sticker"}
          </p>
        )}

        <div className="h-px bg-zinc-800" />

        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase block">
            Độ trong suốt
          </label>
          <div className="flex items-center gap-2">
            <Slider
              value={Math.round((editingEl?.opacity ?? 1) * 100)}
              onValueChange={(v) => update({ opacity: v / 100 })}
              min={0}
              max={100}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-8 text-right">
              {Math.round((editingEl?.opacity ?? 1) * 100)}%
            </span>
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <SectionHeader icon={<Square size={14} />} title="Bo góc" />
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">
              Chọn chế độ bo
            </label>
            <Select
              size="sm"
              value={borderRadiusMode}
              options={BORDER_RADIUS_MODES.map((m) => ({
                label: m.label,
                value: m.value,
              }))}
              onValueChange={(val) => setBorderRadiusMode(String(val))}
              className="bg-[#333]! text-white! border-[#444]! text-center! text-xs!"
              wrapperClassName="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">
              Bán kính bo góc
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: "borderRadiusTopLeft", label: "TL" },
                { key: "borderRadiusTopRight", label: "TR" },
                { key: "borderRadiusBottomLeft", label: "BL" },
                { key: "borderRadiusBottomRight", label: "BR" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-[8px] text-gray-500 block text-center mb-0.5">
                    {label}
                  </label>
                  <InputNumber
                    min={0}
                    max={500}
                    value={(editingEl as any)?.[key] ?? 0}
                    onChange={(e) =>
                      handleBorderRadiusChange(key, Number(e.target.value))
                    }
                    className="text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center p-1.5!"
                    wrapperClassName="w-full"
                    showButtons={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <SectionHeader icon={<Sun size={14} />} title="Đổ bóng" />
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">
              Màu bóng
            </label>
            <ColorPickerRow
              value={editingEl?.shadowColor ?? "#000000"}
              onChange={(v) => update({ shadowColor: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
              Độ mờ bóng
            </label>
            <InputNumber
              min={0}
              max={80}
              value={editingEl?.shadowBlur ?? 0}
              onChange={(e) => update({ shadowBlur: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
              Lệch X
            </label>
            <InputNumber
              min={-100}
              max={100}
              value={editingEl?.shadowOffsetX ?? 0}
              onChange={(e) =>
                update({ shadowOffsetX: Number(e.target.value) })
              }
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 uppercase whitespace-nowrap w-28 text-left">
              Lệch Y
            </label>
            <InputNumber
              min={-100}
              max={100}
              value={editingEl?.shadowOffsetY ?? 0}
              onChange={(e) =>
                update({ shadowOffsetY: Number(e.target.value) })
              }
              className="w-20! text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center"
            />
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <SectionHeader icon={<CloudUpload size={14} />} title="Hiệu ứng" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Bật chuyển động</span>
            <Switch
              checked={editingEl?.motionEnabled ?? false}
              onChange={(v) => update({ motionEnabled: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Chuyển động liên tục</span>
            <Switch
              checked={editingEl?.continuousMotionEnabled ?? false}
              onChange={(v) => update({ continuousMotionEnabled: v })}
            />
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <button
          onClick={handleRemove}
          className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors py-2"
        >
          <Trash2 size={13} />
          Xoá khỏi thiệp
        </button>
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-zinc-100 space-y-3">
      <div className="flex bg-[#2a2a2a] rounded-lg p-0.5">
        <button
          onClick={() => setActiveTab("sticker")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all ${
            activeTab === "sticker"
              ? "bg-[#d4af37]/20 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <CloudUpload size={14} />
          Sticker
        </button>
        <button
          onClick={() => setActiveTab("emoji")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all ${
            activeTab === "emoji"
              ? "bg-[#d4af37]/20 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Smile size={14} />
          Emoji
        </button>
      </div>

      {activeTab === "sticker" && <></>}

      {activeTab === "emoji" && (
        <div className="space-y-4">
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                {cat.name}
              </h4>
              <div className="grid grid-cols-6 gap-1.5">
                {cat.emojis.map((emoji, idx) => {
                  const url = emojiToTwemojiUrl(emoji);
                  return (
                    <button
                      key={`${emoji}-${idx}`}
                      onClick={() => handleAddToCanvas(url, emoji)}
                      className="aspect-square bg-[#2a2a2a] rounded-lg flex items-center justify-center border border-[#333] hover:border-[#d4af37]/50 transition-all hover:scale-110 cursor-pointer text-xl"
                      title={emoji}
                    >
                      <img
                        src={url}
                        alt={emoji}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).parentElement!.textContent = emoji;
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
