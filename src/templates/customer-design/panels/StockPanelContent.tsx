import ColorPickerRow from "@/templates/customer-design/components/ColorPickerRow";
import SectionHeader from "@/templates/customer-design/components/SectionHeader";
import type { EditorElement } from "@/templates/customer-design/types";
import InputNumber from "@/templates/customer-design/ui/input/InputNumber";
import Select from "@/templates/customer-design/ui/Select";
import Slider from "@/templates/customer-design/ui/Slider";
import Switch from "@/templates/customer-design/ui/Switch";
import { BORDER_RADIUS_MODES } from "@/templates/customer-design/utils/constants";
import {
  fitStickerToCanvas,
  loadImageSize,
} from "@/templates/customer-design/utils/image-fit";
import {
  ArrowLeft,
  CloudUpload,
  PenLine,
  Search,
  Smile,
  Square,
  Sticker,
  Sun,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "@/templates/customer-design/ui/input/Input";
import {
  EXTRA_EMOJI_CATEGORIES,
  GRAPHIC_STICKERS,
  ORNAMENT_STICKERS,
  STICKER_CATEGORIES,
  type StickerCategoryId,
  type StockSticker,
} from "../utils/stock-stickers";
import {
  readRecentStickers,
  rememberRecentSticker,
  type RecentSticker,
} from "../utils/recent-stickers";
import stockAssetService, {
  type PublicStockAsset,
} from "@/services/stock-asset.service";

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

type Tab = "sticker" | "ornament" | "emoji";

const EMOJI_CATEGORIES = [
  {
    name: "Trái tim",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💕", "💗", "💖", "💘", "💝", "❣️"],
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
    emojis: ["⭐", "✨", "🌟", "💫", "🪄", "🌙", "☀️", "🌈"],
  },
  {
    name: "Thiên nhiên",
    emojis: ["🕊️", "🦋", "🌈", "🌙", "🌞", "☀️", "🌊", "🌸"],
  },
  {
    name: "Tiệc & Quà",
    emojis: ["🎉", "🎊", "🥂", "🍾", "🎁", "🎀", "🎈", "🎶", "🎵"],
  },
  ...EXTRA_EMOJI_CATEGORIES,
];

function emojiToTwemojiUrl(emoji: string): string {
  const codePoints = Array.from(emoji).map((c) => c.codePointAt(0)!.toString(16));
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${codePoints.join("-")}.png`;
}

function assetToSticker(item: PublicStockAsset): StockSticker {
  const category = (item.category || "party") as StockSticker["category"];
  return {
    id: `api-${item.id}`,
    title: item.title,
    category,
    keywords: item.tags.join(" "),
    url: item.src,
    sourceUrl: item.src,
    set: "fluent-emoji",
    icon: item.id,
    kind: item.kind === "ornament" ? "ornament" : "sticker",
  };
}

function filterStickers(
  list: StockSticker[],
  query: string,
  category: StickerCategoryId,
) {
  const q = query.trim().toLowerCase();
  return list.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });
}

function StickerThumb({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className="relative flex h-full w-full items-center justify-center">
      {!loaded && (
        <span className="absolute inset-2 animate-pulse rounded-lg bg-[#EDE4D5]" />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          (e.target as HTMLImageElement).style.visibility = "hidden";
          setLoaded(true);
        }}
      />
    </span>
  );
}

export default function StockPanelContent({
  onAddImageToCanvas,
  selectedCanvasImageUrl,
  onDeselect,
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}: StockPanelContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("sticker");
  const [stickerQuery, setStickerQuery] = useState("");
  const [stickerCategory, setStickerCategory] = useState<StickerCategoryId>("all");
  const [ornamentQuery, setOrnamentQuery] = useState("");
  const [panelView, setPanelView] = useState<"list" | "detail">("list");
  const [selectedItem, setSelectedItem] = useState<{ url: string; title: string } | null>(null);
  const [borderRadiusMode, setBorderRadiusMode] = useState("all");
  const [recent, setRecent] = useState<RecentSticker[]>([]);
  const [remoteStickers, setRemoteStickers] = useState<StockSticker[]>([]);
  const [remoteTotal, setRemoteTotal] = useState(0);
  const [remoteSkip, setRemoteSkip] = useState(0);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const skipDetailRef = useRef(false);

  useEffect(() => {
    setRecent(readRecentStickers());
  }, []);

  useEffect(() => {
    setRemoteStickers([]);
    setRemoteTotal(0);
    setRemoteSkip(0);
  }, [activeTab, stickerQuery, stickerCategory, ornamentQuery]);

  const localStickers = useMemo(
    () => filterStickers(GRAPHIC_STICKERS, stickerQuery, stickerCategory),
    [stickerQuery, stickerCategory],
  );
  const ornaments = useMemo(
    () => filterStickers(ORNAMENT_STICKERS, ornamentQuery, "all"),
    [ornamentQuery],
  );
  const remoteForTab = useMemo(
    () =>
      remoteStickers.filter((item) =>
        activeTab === "ornament" ? item.kind === "ornament" : item.kind !== "ornament",
      ),
    [remoteStickers, activeTab],
  );

  const editingEl = useMemo(
    () => (selectedElement?.type === "image" ? selectedElement : null),
    [selectedElement],
  );

  useEffect(() => {
    if (skipDetailRef.current) {
      skipDetailRef.current = false;
      return;
    }
    if (selectedCanvasImageUrl && selectedElement?.type === "image") {
      setSelectedItem({ url: selectedCanvasImageUrl, title: "" });
      setPanelView("detail");
    }
  }, [selectedCanvasImageUrl, selectedElement?.id, selectedElement?.type]);

  useEffect(() => {
    if (!selectedCanvasImageUrl && panelView === "detail" && !selectedItem) {
      setPanelView("list");
      setSelectedItem(null);
    }
  }, [selectedCanvasImageUrl, panelView, selectedItem]);

  const insertImage = useCallback(
    async (url: string, title: string, id: string, maxSize: number) => {
      skipDetailRef.current = true;
      setRecent(rememberRecentSticker({ id, url, title }));
      const nat = await loadImageSize(url);
      const { width: w, height: h } = fitStickerToCanvas(
        nat.width,
        nat.height,
        maxSize,
      );
      onAddImageToCanvas(url, { width: w, height: h });
    },
    [onAddImageToCanvas],
  );

  const handleAddSticker = (item: Pick<StockSticker, "id" | "url" | "title">) => {
    void insertImage(item.url, item.title, item.id, 112);
  };

  const handleAddEmoji = (emoji: string) => {
    const url = emojiToTwemojiUrl(emoji);
    void insertImage(url, emoji, `emoji-${emoji}`, 96);
  };

  const loadMoreRemote = async () => {
    setRemoteLoading(true);
    const kind = activeTab === "ornament" ? "ornament" : "sticker";
    const q = activeTab === "ornament" ? ornamentQuery : stickerQuery;
    const category =
      activeTab === "sticker" && stickerCategory !== "all" ? stickerCategory : undefined;
    const result = await stockAssetService.listPublic({
      kind,
      q: q.trim() || undefined,
      category,
      skip: remoteSkip,
      take: 24,
    });
    const mapped = result.items.map(assetToSticker);
    const known = new Set([
      ...GRAPHIC_STICKERS.map((item) => item.url),
      ...ORNAMENT_STICKERS.map((item) => item.url),
      ...remoteStickers.map((item) => item.url),
    ]);
    setRemoteStickers((prev) => [
      ...prev,
      ...mapped.filter((item) => !known.has(item.url)),
    ]);
    setRemoteSkip((prev) => prev + result.items.length);
    setRemoteTotal(result.total);
    setRemoteLoading(false);
  };

  const update = (updates: Partial<EditorElement>) => {
    if (editingEl && onUpdateElement) onUpdateElement(editingEl.id, updates);
  };

  const handleBackToList = () => {
    setPanelView("list");
    setSelectedItem(null);
    onDeselect?.();
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
    update(updates as Partial<EditorElement>);
  };

  const handleRemove = () => {
    if (editingEl && onDeleteElement) onDeleteElement(editingEl.id);
    handleBackToList();
  };

  const renderGrid = (items: StockSticker[]) => (
    <div className="grid grid-cols-3 gap-1.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleAddSticker(item)}
          title={item.title}
          className="flex aspect-square flex-col items-center justify-center rounded-xl border border-[#D9CDBE] bg-[#F3EDE3] p-1.5 transition-all hover:scale-[1.03] hover:border-[#2D231F] hover:bg-[#EDE4D5]"
        >
          <StickerThumb
            src={item.url}
            alt={item.title}
            className="h-10 w-10 object-contain"
          />
        </button>
      ))}
    </div>
  );

  if (panelView === "detail") {
    const currentSrc = editingEl?.src ?? selectedItem?.url ?? "";
    if (!currentSrc) {
      return (
        <div className="flex items-center justify-center h-40 text-[#7A6A5C]/70 text-sm">
          Đang tải...
        </div>
      );
    }

    return (
      <div className="w-full font-sans text-[#2D231F] space-y-4 pb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-xs text-[#7A6A5C] hover:text-[#2D231F] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Thêm sticker khác
        </button>

        <div className="relative rounded-xl overflow-hidden border border-[#D9CDBE] bg-[#F3EDE3] flex items-center justify-center w-full">
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

        <div className="h-px bg-[#D9CDBE]" />

        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase block">Độ trong suốt</label>
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

        <div className="h-px bg-[#D9CDBE]" />

        <SectionHeader icon={<Square size={14} />} title="Bo góc" />
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Chọn chế độ bo</label>
            <Select
              size="sm"
              value={borderRadiusMode}
              options={BORDER_RADIUS_MODES.map((m) => ({
                label: m.label,
                value: m.value,
              }))}
              onValueChange={(val) => setBorderRadiusMode(String(val))}
              className="bg-[#EDE4D5]! text-[#2D231F]! border-[#D9CDBE]! text-center! text-xs!"
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
                    className="text-[10px]! bg-[#EDE4D5] text-[#2D231F] border border-[#D9CDBE] rounded outline-none focus:border-[#2D231F] text-center p-1.5!"
                    wrapperClassName="w-full"
                    showButtons={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-[#D9CDBE]" />

        <SectionHeader icon={<Sun size={14} />} title="Đổ bóng" />
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Màu bóng</label>
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
              className="w-20! text-[10px]! bg-[#EDE4D5] text-[#2D231F] border border-[#D9CDBE] rounded outline-none focus:border-[#2D231F] text-center"
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
              onChange={(e) => update({ shadowOffsetX: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#EDE4D5] text-[#2D231F] border border-[#D9CDBE] rounded outline-none focus:border-[#2D231F] text-center"
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
              onChange={(e) => update({ shadowOffsetY: Number(e.target.value) })}
              className="w-20! text-[10px]! bg-[#EDE4D5] text-[#2D231F] border border-[#D9CDBE] rounded outline-none focus:border-[#2D231F] text-center"
            />
          </div>
        </div>

        <div className="h-px bg-[#D9CDBE]" />

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

        <div className="h-px bg-[#D9CDBE]" />

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

  const tabs: { id: Tab; label: string; icon: typeof Sticker }[] = [
    { id: "sticker", label: "Sticker", icon: Sticker },
    { id: "ornament", label: "Họa tiết", icon: PenLine },
    { id: "emoji", label: "Emoji", icon: Smile },
  ];

  return (
    <div className="w-full font-sans text-[#2D231F] space-y-3">
      <div className="grid grid-cols-3 bg-[#EDE4D5] rounded-lg p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-[#F3EDE3] text-[#2D231F] shadow-sm"
                : "text-[#7A6A5C] hover:text-[#2D231F]"
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {editingEl && (
        <button
          type="button"
          onClick={() => {
            setSelectedItem({ url: editingEl.src || "", title: "" });
            setPanelView("detail");
          }}
          className="w-full rounded-lg border border-[#D9CDBE] bg-[#EDE4D5] px-3 py-2 text-left text-[11px] text-[#2D231F] hover:border-[#2D231F]"
        >
          Đang chọn ảnh trên thiệp — chỉnh opacity, bo góc, bóng
        </button>
      )}

      {recent.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] text-[#7A6A5C] uppercase tracking-wider">Đã dùng gần đây</h4>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {recent.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.title}
                onClick={() => handleAddSticker(item)}
                className="h-12 w-12 shrink-0 rounded-lg border border-[#D9CDBE] bg-[#F3EDE3] p-1 transition-transform hover:scale-105 hover:border-[#2D231F]"
              >
                <StickerThumb
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sticker" && (
        <div className="space-y-3">
          <Input
            type="text"
            inputSize="sm"
            placeholder="Tìm sticker..."
            value={stickerQuery}
            onChange={(e) => setStickerQuery(e.target.value)}
            leftIcon={<Search size={14} />}
            className="bg-[#F3EDE3]! text-[#2D231F]!"
          />
          <div className="flex flex-wrap gap-1">
            {STICKER_CATEGORIES.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStickerCategory(tab.id)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                  stickerCategory === tab.id
                    ? "bg-[#2D231F] text-[#F3EDE3]"
                    : "bg-[#EDE4D5] text-[#7A6A5C] hover:text-[#2D231F]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {localStickers.length === 0 && remoteForTab.length === 0 ? (
            <p className="py-8 text-center text-[11px] text-[#7A6A5C]">
              Không tìm thấy sticker phù hợp.
            </p>
          ) : (
            renderGrid([...localStickers, ...remoteForTab])
          )}
          {!(remoteTotal > 0 && remoteSkip >= remoteTotal) && (
            <button
              type="button"
              onClick={() => void loadMoreRemote()}
              disabled={remoteLoading}
              className="w-full rounded-lg border border-[#D9CDBE] py-2 text-[11px] font-semibold text-[#7A6A5C] hover:border-[#2D231F] hover:text-[#2D231F] disabled:opacity-60"
            >
              {remoteLoading ? "Đang tải..." : "Xem thêm từ thư viện InviGo"}
            </button>
          )}
          {remoteTotal > 0 && (
            <p className="text-center text-[10px] text-[#7A6A5C]">
              Thư viện: {remoteStickers.length}/{remoteTotal}
            </p>
          )}
        </div>
      )}

      {activeTab === "ornament" && (
        <div className="space-y-3">
          <p className="text-[11px] leading-relaxed text-[#7A6A5C]">
            Họa tiết nét mực — hợp khung thiệp, tách riêng khỏi sticker 3D.
          </p>
          <Input
            type="text"
            inputSize="sm"
            placeholder="Tìm họa tiết..."
            value={ornamentQuery}
            onChange={(e) => setOrnamentQuery(e.target.value)}
            leftIcon={<Search size={14} />}
            className="bg-[#F3EDE3]! text-[#2D231F]!"
          />
          {ornaments.length === 0 && remoteForTab.length === 0 ? (
            <p className="py-8 text-center text-[11px] text-[#7A6A5C]">
              Không tìm thấy họa tiết phù hợp.
            </p>
          ) : (
            renderGrid([...ornaments, ...remoteForTab])
          )}
          <button
            type="button"
            onClick={() => void loadMoreRemote()}
            disabled={remoteLoading}
            className="w-full rounded-lg border border-[#D9CDBE] py-2 text-[11px] font-semibold text-[#7A6A5C] hover:border-[#2D231F] hover:text-[#2D231F] disabled:opacity-60"
          >
            {remoteLoading ? "Đang tải..." : "Xem thêm từ thư viện InviGo"}
          </button>
        </div>
      )}

      {activeTab === "emoji" && (
        <div className="space-y-4">
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <h4 className="text-[10px] text-[#7A6A5C] uppercase tracking-wider mb-2">
                {cat.name}
              </h4>
              <div className="grid grid-cols-6 gap-1.5">
                {cat.emojis.map((emoji, idx) => {
                  const url = emojiToTwemojiUrl(emoji);
                  return (
                    <button
                      key={`${emoji}-${idx}`}
                      onClick={() => handleAddEmoji(emoji)}
                      className="aspect-square bg-[#EDE4D5] rounded-lg flex items-center justify-center border border-[#D9CDBE] hover:border-[#2D231F] transition-all hover:scale-105 cursor-pointer text-xl"
                      title={emoji}
                    >
                      <img
                        src={url}
                        alt={emoji}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).parentElement!.textContent = emoji;
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

      <p className="pt-2 text-[10px] leading-relaxed text-[#7A6A5C]/80">
        Emoji: Fluent UI Emoji (MIT), Twemoji (CC-BY). Họa tiết: Lucide (ISC).
      </p>
    </div>
  );
}
