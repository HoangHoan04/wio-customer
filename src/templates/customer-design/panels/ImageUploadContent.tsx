import { useToast } from "@/hooks/useToast";
import { uploadService } from "@/services/upload.service";
import ColorPickerRow from "@/templates/customer-design/components/ColorPickerRow";
import SectionHeader from "@/templates/customer-design/components/SectionHeader";
import type { EditorElement } from "@/templates/customer-design/types";
import InputNumber from "@/templates/customer-design/ui/input/InputNumber";
import Select from "@/templates/customer-design/ui/Select";
import Slider from "@/templates/customer-design/ui/Slider";
import Switch from "@/templates/customer-design/ui/Switch";
import { BORDER_RADIUS_MODES } from "@/templates/customer-design/utils/constants";
import tokenCache from "@/utils/token-cache";
import {
  ArrowLeft,
  CloudUpload,
  HardDrive,
  ImageIcon,
  ImagePlus,
  Loader2,
  Square,
  Sun,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UploadedItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: "file";
}

interface ImageUploadContentProps {
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

const MAX_BATCH_FILES = 10;
const MAX_TOTAL_SIZE_BYTES = 10 * 1024 * 1024 * 1024;

type FitMode = "original" | "contain" | "custom";

const FIT_MODE_OPTIONS = [
  { label: "Kích thước gốc", value: "original" },
  { label: "Vừa khung canvas (Contain)", value: "contain" },
  { label: "Tuỳ chỉnh", value: "custom" },
];

function loadImageSize(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 200, h: 200 });
    img.src = url;
  });
}

export default function ImageUploadContent({
  onAddImageToCanvas,
  selectedCanvasImageUrl,
  onDeselect,
  selectedElement,
  onUpdateElement,
  elements = [],
  onDeleteElement,
  onDeleteElements,
  canvasWidth = 440,
}: ImageUploadContentProps) {
  const { showToast } = useToast();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [panelView, setPanelView] = useState<"list" | "detail">("list");
  const [selectedItem, setSelectedItem] = useState<UploadedItem | null>(null);
  const [borderRadiusMode, setBorderRadiusMode] = useState("all");
  const [fitMode, setFitMode] = useState<FitMode>("original");
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const swapInputRef = useRef<HTMLInputElement>(null);
  const totalSizeBytes = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
  const totalSizeGB = totalSizeBytes / (1024 * 1024 * 1024);
  const isStorageFull = totalSizeBytes >= MAX_TOTAL_SIZE_BYTES;

  const editingEl = selectedElement?.type === "image" ? selectedElement : null;

  useEffect(() => {
    if (!selectedCanvasImageUrl && panelView === "detail") {
      setPanelView("list");
      setSelectedItem(null);
    }
  }, [selectedCanvasImageUrl, panelView]);

  useEffect(() => {
    if (selectedCanvasImageUrl) {
      const found = uploadedFiles.find((f) => f.url === selectedCanvasImageUrl);
      if (found) {
        setSelectedItem(found);
        setPanelView("detail");
      }
    }
  }, [selectedCanvasImageUrl, uploadedFiles]);

  const processFiles = useCallback(
    async (rawFiles: File[]) => {
      if (!tokenCache.isAuthenticated()) {
        showToast({
          title: "Yêu cầu đăng nhập",
          message: "Bạn cần đăng nhập để tải ảnh lên.",
          type: "info",
          timeout: 2500,
        });
        return;
      }

      const imageFiles = rawFiles.filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) {
        showToast({
          title: "Không hợp lệ",
          message: "Chỉ chấp nhận file ảnh (jpg, png, webp, gif, ...).",
          type: "error",
          timeout: 2500,
        });
        return;
      }

      if (totalSizeBytes >= MAX_TOTAL_SIZE_BYTES) {
        showToast({
          title: "Đã đầy dung lượng",
          message: "Tổng dung lượng đã đạt 10 GB. Hãy xóa bớt ảnh để tiếp tục.",
          type: "error",
          timeout: 3000,
        });
        return;
      }

      const filesToUpload = imageFiles.slice(0, MAX_BATCH_FILES);
      if (imageFiles.length > MAX_BATCH_FILES) {
        showToast({
          title: "Giới hạn mỗi lượt",
          message: `Mỗi lượt tải tối đa ${MAX_BATCH_FILES} ảnh. ${imageFiles.length - MAX_BATCH_FILES} ảnh còn lại bị bỏ qua.`,
          type: "info",
          timeout: 3500,
        });
      }

      const newTotalSize =
        totalSizeBytes + filesToUpload.reduce((sum, f) => sum + f.size, 0);
      if (newTotalSize > MAX_TOTAL_SIZE_BYTES) {
        showToast({
          title: "Vượt giới hạn dung lượng",
          message: "Tổng dung lượng sẽ vượt quá 10 GB. Hãy chọn ảnh nhỏ hơn.",
          type: "error",
          timeout: 3000,
        });
        return;
      }

      setLoading(true);
      try {
        const results: UploadedItem[] = [];
        for (const file of filesToUpload) {
          const res = await uploadService.uploadImage(file);
          const url = res?.fileUrl;
          if (url) {
            results.push({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              name: file.name,
              url,
              size: file.size,
              type: "file",
            });
          }
        }

        if (results.length > 0) {
          setUploadedFiles((prev) => [...prev, ...results]);
          showToast({
            title: "Tải lên thành công",
            message: `Đã tải lên ${results.length} ảnh.`,
            type: "success",
            timeout: 1500,
          });
        }
      } catch (err: any) {
        showToast({
          title: "Lỗi tải lên",
          message: err?.message || "Không thể tải lên tệp.",
          type: "error",
          timeout: 3000,
        });
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [uploadedFiles, totalSizeBytes, showToast],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
  };

  const handleDropZoneClick = () => {
    if (loading || isStorageFull) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleAddToCanvas = async (item: UploadedItem) => {
    setSelectedItem(item);
    setPanelView("detail");
    setFitMode("original");

    const nat = await loadImageSize(item.url);
    setNaturalSize(nat);

    let w = nat.w;
    let h = nat.h;
    if (w > canvasWidth) {
      const ratio = h / w;
      w = canvasWidth;
      h = Math.round(w * ratio);
    }

    onAddImageToCanvas(item.url, { width: w, height: h });
  };

  const applyFitMode = (
    mode: FitMode,
    nat: { w: number; h: number } | null,
  ) => {
    if (!editingEl || !onUpdateElement || !nat) return;
    if (mode === "original" || mode === "contain") {
      let w = nat.w;
      let h = nat.h;
      if (w > canvasWidth) {
        const ratio = h / w;
        w = canvasWidth;
        h = Math.round(w * ratio);
      }
      onUpdateElement(editingEl.id, { width: w, height: h });
    }
  };

  const handleSwapImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!editingEl || !onUpdateElement) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast({
        title: "Không hợp lệ",
        message: "Chỉ chấp nhận file ảnh.",
        type: "error",
        timeout: 2000,
      });
      return;
    }
    if (!tokenCache.isAuthenticated()) {
      showToast({
        title: "Yêu cầu đăng nhập",
        message: "Bạn cần đăng nhập.",
        type: "info",
        timeout: 2500,
      });
      return;
    }
    setSwapLoading(true);
    try {
      const res = await uploadService.uploadImage(file);
      const newUrl = res?.fileUrl;
      if (newUrl) {
        onUpdateElement(editingEl.id, { src: newUrl });
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.url === editingEl.src
              ? { ...f, url: newUrl, name: file.name, size: file.size }
              : f,
          ),
        );
        setSelectedItem((prev) => (prev ? { ...prev, url: newUrl } : prev));
        showToast({
          title: "Đổi ảnh thành công",
          message: "",
          type: "success",
          timeout: 1500,
        });
      }
    } catch (err: any) {
      showToast({
        title: "Lỗi",
        message: err?.message || "Không thể đổi ảnh.",
        type: "error",
        timeout: 2500,
      });
    } finally {
      setSwapLoading(false);
      if (swapInputRef.current) swapInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    const removedFile = uploadedFiles.find((f) => f.id === id);
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    if (removedFile) {
      const idsToDelete = elements
        .filter((el) => el.type === "image" && el.src === removedFile.url)
        .map((el) => el.id);

      if (idsToDelete.length > 0) {
        if (onDeleteElements) {
          onDeleteElements(idsToDelete);
        } else if (onDeleteElement) {
          idsToDelete.forEach((elId) => onDeleteElement(elId));
        }
      }
    }

    if (selectedItem?.id === id) {
      setPanelView("list");
      setSelectedItem(null);
      onDeselect?.();
    }
  };

  const handleBackToList = () => {
    setPanelView("list");
    setSelectedItem(null);
    onDeselect?.();
  };

  const update = (updates: Partial<EditorElement>) => {
    if (editingEl && onUpdateElement) {
      onUpdateElement(editingEl.id, updates);
    }
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

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (panelView === "detail" && selectedItem) {
    const currentSrc = editingEl?.src ?? selectedItem.url;

    return (
      <div className="w-full font-sans text-zinc-100 space-y-4 pb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Quay lại danh sách
        </button>

        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square max-h-44 w-full mx-auto">
          <img
            src={currentSrc}
            alt={selectedItem.name}
            className="w-full h-full object-cover"
          />
          {swapLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 size={28} className="text-amber-400 animate-spin" />
            </div>
          )}
        </div>

        <div>
          <input
            ref={swapInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSwapImageChange}
          />
          <button
            onClick={() => swapInputRef.current?.click()}
            disabled={swapLoading}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 rounded-lg py-2 transition-all disabled:opacity-50"
          >
            <ImagePlus size={14} />
            Đổi ảnh
          </button>
        </div>

        <p className="text-[10px] text-zinc-600 truncate -mt-2">
          {selectedItem.name}
        </p>

        <div className="h-px bg-zinc-800" />

        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">
              Kiểu kích thước
            </label>
            <Select
              size="sm"
              value={fitMode}
              options={FIT_MODE_OPTIONS}
              onValueChange={(val) => {
                const mode = val as FitMode;
                setFitMode(mode);
                applyFitMode(mode, naturalSize);
              }}
              className="bg-[#333]! text-white! border-[#444]! text-xs!"
              wrapperClassName="w-full"
            />
            {naturalSize && (
              <p className="text-[9px] text-zinc-600 mt-1">
                Kích thước gốc: {naturalSize.w} × {naturalSize.h} px
              </p>
            )}
          </div>

          {fitMode === "custom" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] text-zinc-600 block mb-1">
                  Rộng (px)
                </label>
                <InputNumber
                  min={10}
                  max={4000}
                  value={editingEl?.width ?? 200}
                  onChange={(e) => update({ width: Number(e.target.value) })}
                  className="text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center p-1.5!"
                  wrapperClassName="w-full"
                  showButtons={false}
                />
              </div>
              <div>
                <label className="text-[8px] text-zinc-600 block mb-1">
                  Cao (px)
                </label>
                <InputNumber
                  min={10}
                  max={4000}
                  value={editingEl?.height ?? 200}
                  onChange={(e) => update({ height: Number(e.target.value) })}
                  className="text-[10px]! bg-[#333] text-white border border-[#444] rounded outline-none focus:border-[#d4af37] text-center p-1.5!"
                  wrapperClassName="w-full"
                  showButtons={false}
                />
              </div>
            </div>
          )}

          {fitMode !== "custom" && editingEl && (
            <p className="text-[9px] text-zinc-600">
              Hiện tại: {editingEl.width} × {editingEl.height} px
            </p>
          )}
        </div>

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
          onClick={() => handleRemoveFile(selectedItem.id)}
          className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors py-2"
        >
          <Trash2 size={13} />
          Xoá khỏi danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-zinc-100">
      <div
        onClick={handleDropZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group border-2 border-dashed rounded-2xl text-center transition-all duration-300 cursor-pointer
          ${isStorageFull ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragging ? "border-amber-400 bg-amber-500/8 scale-[1.01]" : "border-zinc-800 hover:border-amber-500 hover:bg-amber-500/3"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={loading || isStorageFull}
        />

        <div className="flex flex-col items-center justify-center p-4">
          <div
            className={`mb-3 transition-transform duration-300 group-hover:scale-110 ${isDragging ? "scale-110" : ""}`}
          >
            {loading ? (
              <Loader2
                size={48}
                className="text-amber-500 animate-spin drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              />
            ) : (
              <CloudUpload
                size={48}
                className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              />
            )}
          </div>
          <p className="text-zinc-300 text-sm font-medium leading-relaxed px-2">
            {loading ? (
              "Đang tải lên..."
            ) : isDragging ? (
              "Thả ảnh vào đây..."
            ) : isStorageFull ? (
              "Đã đầy dung lượng 10 GB"
            ) : (
              <>
                Kéo thả hoặc nhấn để tải{" "}
                <span className="text-amber-400 font-semibold">ảnh</span>
              </>
            )}
          </p>
          {!loading && !isStorageFull && (
            <p className="text-[11px] text-zinc-600 mt-1">
              Tối đa {MAX_BATCH_FILES} ảnh mỗi lượt • Tổng dung lượng ≤ 10 GB
            </p>
          )}
        </div>

        <div className="w-full flex items-center justify-between text-xs py-2 px-4 bg-zinc-900/40 border-t border-zinc-800/80 rounded-b-2xl">
          <div className="flex items-center gap-1 flex-1 justify-center">
            <span className="text-zinc-500 font-medium">Đã tải:</span>
            <span className="text-amber-400 font-bold">
              {uploadedFiles.length}
            </span>
            <span className="text-zinc-500 font-medium">ảnh</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700 shrink-0 mx-2" />
          <div className="flex items-center gap-1 flex-1 justify-center">
            <HardDrive
              size={11}
              className={isStorageFull ? "text-red-400" : "text-amber-500"}
            />
            <span
              className={
                isStorageFull ? "text-red-400 font-bold" : "text-zinc-400"
              }
            >
              {totalSizeGB < 0.01
                ? `${(totalSizeBytes / (1024 * 1024)).toFixed(0)} MB`
                : `${totalSizeGB.toFixed(2)} GB`}
            </span>
            <span className="text-zinc-600">/ 10 GB</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mt-4 mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-200 tracking-wide">
              Danh sách ảnh đã tải
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {uploadedFiles.length} ảnh
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
            <HardDrive size={13} className="text-amber-500" />
            <span>
              {totalSizeGB < 0.01
                ? `${(totalSizeBytes / (1024 * 1024)).toFixed(0)} MB`
                : `${totalSizeGB.toFixed(2)} GB`}{" "}
              / 10 GB
            </span>
          </div>
        </div>

        <div className="min-h-40 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-3 mt-1 backdrop-blur-sm">
          {uploadedFiles.length === 0 ? (
            <div className="w-full h-36 flex flex-col items-center justify-center text-zinc-600 text-sm gap-2">
              <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800">
                <ImageIcon size={22} className="text-zinc-700" />
              </div>
              <span className="text-xs">Chưa có ảnh nào được tải lên</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {uploadedFiles.map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onAddToCanvas={handleAddToCanvas}
                  onRemove={handleRemoveFile}
                  formatSize={formatSize}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ImageCardProps {
  item: UploadedItem;
  isSelected: boolean;
  onAddToCanvas: (item: UploadedItem) => void;
  onRemove: (id: string) => void;
  formatSize: (bytes: number) => string;
}
function ImageCard({
  item,
  isSelected,
  onAddToCanvas,
  onRemove,
  formatSize,
}: ImageCardProps) {
  return (
    <div
      className={`relative group rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer
        ${isSelected ? "border-amber-500 ring-1 ring-amber-500/50" : "border-zinc-800 hover:border-zinc-600"}`}
      onClick={() => onAddToCanvas(item)}
    >
      <div className="aspect-square bg-zinc-900">
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="absolute top-1 right-1 p-1 rounded-md bg-zinc-900/70 text-zinc-500 hover:bg-red-900/80 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <Trash2 size={12} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-linear-to-t from-black/80 to-transparent">
        <p className="text-[9px] text-zinc-300 truncate leading-tight">
          {item.name}
        </p>
        <p className="text-[8px] text-zinc-500">{formatSize(item.size)}</p>
      </div>
    </div>
  );
}
