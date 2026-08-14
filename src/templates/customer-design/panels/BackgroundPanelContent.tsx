import { uploadService } from "@/services/upload.service";
import Slider from "@/templates/customer-design/ui/Slider";
import tokenCache from "@/utils/token-cache";
import {
  Check,
  Droplet,
  ImagePlus,
  Loader2,
  Palette,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import {
  SYSTEM_WALLPAPERS,
  WEDDING_BG_COLORS,
  WEDDING_GRADIENT_COLORS,
} from "../utils/constants";

interface BackgroundPanelContentProps {
  canvasBackground: string;
  backgroundOpacity: number;
  bgType: "color" | "image";
  onSetBackground: (value: string, type: "color" | "image") => void;
  onSetBackgroundOpacity: (opacity: number) => void;
}

interface UploadedItem {
  id: string;
  name: string;
  url: string;
}

type Tab = "color" | "gradient" | "image";

const CHECKER = {
  backgroundImage:
    "linear-gradient(45deg, #D9CDBE 25%, transparent 25%), linear-gradient(-45deg, #D9CDBE 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #D9CDBE 75%), linear-gradient(-45deg, transparent 75%, #D9CDBE 75%)",
  backgroundSize: "10px 10px",
  backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0",
  backgroundColor: "#F3EDE3",
};

function isImageBg(value: string) {
  return (
    value.startsWith("http") ||
    value.startsWith("blob:") ||
    value.startsWith("data:") ||
    value.startsWith("/")
  );
}

function isGradientBg(value: string) {
  return value.includes("gradient");
}

function tabFromBackground(value: string): Tab {
  if (isImageBg(value)) return "image";
  if (isGradientBg(value)) return "gradient";
  return "color";
}

function kindLabel(value: string) {
  if (value === "transparent") return "Trong suốt";
  if (isImageBg(value)) return "Hình nền";
  if (isGradientBg(value)) return "Gradient";
  return "Màu đơn";
}

function pickerHex(value: string) {
  if (value.startsWith("#") && value.length <= 9) return value;
  const match = value.match(/#[0-9A-Fa-f]{3,8}/);
  return match?.[0] ?? "#F3EDE3";
}

function PreviewFill({ value }: { value: string }) {
  if (value === "transparent") {
    return <div className="absolute inset-0" style={CHECKER} />;
  }
  if (isImageBg(value)) {
    return (
      <img
        src={value}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }
  return <div className="absolute inset-0" style={{ background: value }} />;
}

function SelectedMark({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2D231F] text-[#F3EDE3] shadow-sm">
      <Check size={10} strokeWidth={3} />
    </span>
  );
}

export default function BackgroundPanelContent({
  canvasBackground,
  backgroundOpacity,
  onSetBackground,
  onSetBackgroundOpacity,
}: BackgroundPanelContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    tabFromBackground(canvasBackground),
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadHint, setUploadHint] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bg_uploaded_images");
      if (saved) setUploadedImages(JSON.parse(saved));
    } catch {
      //! ignore */
    }
  }, []);

  const persistImages = useCallback((imgs: UploadedItem[]) => {
    setUploadedImages(imgs);
    try {
      localStorage.setItem("bg_uploaded_images", JSON.stringify(imgs));
    } catch {
      //! ignore */
    }
  }, []);

  const processFiles = useCallback(
    async (rawFiles: File[]) => {
      if (!tokenCache.isAuthenticated()) {
        setUploadHint("Đăng nhập để tải ảnh nền của bạn.");
        return;
      }
      setUploadHint("");
      const imageFiles = rawFiles.filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      setLoading(true);
      try {
        const results: UploadedItem[] = [];
        for (const file of imageFiles.slice(0, 5)) {
          const res = await uploadService.uploadImage(file);
          const url = res?.fileUrl;
          if (url) {
            results.push({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              name: file.name,
              url,
            });
          }
        }
        if (results.length > 0) {
          persistImages([...results, ...uploadedImages]);
          onSetBackground(results[0].url, "image");
          setActiveTab("image");
        }
      } catch {
        setUploadHint("Không tải được ảnh. Thử lại sau.");
      } finally {
        setLoading(false);
      }
    },
    [uploadedImages, persistImages, onSetBackground],
  );

  const handleFilePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        void processFiles(Array.from(e.target.files));
      }
      e.target.value = "";
    },
    [processFiles],
  );

  const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
    { id: "color", label: "Màu", icon: Palette },
    { id: "gradient", label: "Gradient", icon: Droplet },
    { id: "image", label: "Ảnh", icon: ImagePlus },
  ];

  const opacityPct = Math.round(backgroundOpacity * 100);

  const previewCaption = useMemo(
    () => kindLabel(canvasBackground),
    [canvasBackground],
  );

  return (
    <div className="w-full font-sans text-[#2D231F] select-none">
      <div className="mb-3 overflow-hidden rounded-2xl border border-[#D9CDBE] bg-[#EDE4D5]">
        <div className="relative mx-auto my-3 h-28 w-18 overflow-hidden rounded-md border border-[#D9CDBE] shadow-[0_8px_20px_rgba(45,35,31,0.12)]">
          <PreviewFill value={canvasBackground} />
          <div
            className="absolute inset-0 bg-[#F3EDE3]"
            style={{ opacity: 1 - backgroundOpacity }}
          />
        </div>
        <div className="border-t border-[#D9CDBE] bg-[#F3EDE3] px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
            Nền hiện tại
          </p>
          <p className="truncate text-xs font-medium text-[#2D231F]">
            {previewCaption}
            {canvasBackground.startsWith("#")
              ? ` · ${canvasBackground.toUpperCase()}`
              : ""}
          </p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 rounded-lg bg-[#EDE4D5] p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-1 rounded-md py-2 text-[11px] font-semibold transition-all ${
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

      <div className="space-y-4">
        {activeTab === "color" && (
          <>
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
                Tùy chỉnh
              </p>
              <ColorPickerRow
                value={pickerHex(canvasBackground)}
                onChange={(color) => onSetBackground(color, "color")}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
                Màu có sẵn
              </p>
              <div className="grid grid-cols-7 gap-2">
                {WEDDING_BG_COLORS.map((color) => {
                  const selected = canvasBackground === color;
                  const transparent = color === "transparent";
                  return (
                    <button
                      key={color}
                      type="button"
                      title={transparent ? "Trong suốt" : color}
                      onClick={() => onSetBackground(color, "color")}
                      className={`relative aspect-square rounded-full border transition-transform hover:scale-110 ${
                        selected
                          ? "border-[#2D231F] ring-2 ring-[#2D231F]/20"
                          : "border-[#D9CDBE] hover:border-[#2D231F]"
                      }`}
                      style={transparent ? CHECKER : { backgroundColor: color }}
                    >
                      <SelectedMark show={selected} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === "gradient" && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
              Kiểu chuyển màu
            </p>
            <div className="grid grid-cols-3 gap-2">
              {WEDDING_GRADIENT_COLORS.map((gradient) => {
                const selected = canvasBackground === gradient;
                return (
                  <button
                    key={gradient}
                    type="button"
                    onClick={() => onSetBackground(gradient, "color")}
                    className={`relative aspect-3/4 overflow-hidden rounded-xl border transition-transform hover:scale-[1.03] ${
                      selected
                        ? "border-[#2D231F] ring-2 ring-[#2D231F]/15"
                        : "border-[#D9CDBE] hover:border-[#2D231F]"
                    }`}
                    style={{ background: gradient }}
                  >
                    <SelectedMark show={selected} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "image" && (
          <>
            <button
              type="button"
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files.length > 0) {
                  void processFiles(Array.from(e.dataTransfer.files));
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition-colors ${
                isDragging
                  ? "border-[#2D231F] bg-[#EDE4D5]"
                  : "border-[#D9CDBE] bg-[#F3EDE3] hover:border-[#2D231F] hover:bg-[#EDE4D5]"
              }`}
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin text-[#7A6A5C]" />
              ) : (
                <UploadCloud size={22} className="text-[#7A6A5C]" />
              )}
              <span className="text-center text-[11px] leading-relaxed text-[#7A6A5C]">
                {loading
                  ? "Đang tải ảnh..."
                  : "Kéo thả hoặc bấm để tải ảnh nền"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilePick}
                className="hidden"
              />
            </button>
            {uploadHint && (
              <p className="text-[11px] text-[#7A6A5C]">{uploadHint}</p>
            )}

            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
                  Đã tải lên
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {uploadedImages.map((img) => {
                    const selected = canvasBackground === img.url;
                    return (
                      <div
                        key={img.id}
                        className="group relative aspect-square"
                      >
                        <button
                          type="button"
                          onClick={() => onSetBackground(img.url, "image")}
                          className={`h-full w-full overflow-hidden rounded-xl border bg-cover bg-center transition-transform hover:scale-[1.03] ${
                            selected
                              ? "border-[#2D231F] ring-2 ring-[#2D231F]/15"
                              : "border-[#D9CDBE] hover:border-[#2D231F]"
                          }`}
                          style={{ backgroundImage: `url(${img.url})` }}
                        >
                          <SelectedMark show={selected} />
                        </button>
                        <button
                          type="button"
                          title="Xóa ảnh"
                          onClick={(e) => {
                            e.stopPropagation();
                            persistImages(
                              uploadedImages.filter((row) => row.id !== img.id),
                            );
                          }}
                          className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#2D231F]/80 text-[#F3EDE3] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
                Mẫu có sẵn
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SYSTEM_WALLPAPERS.map((imgUrl) => {
                  const selected = canvasBackground === imgUrl;
                  return (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => onSetBackground(imgUrl, "image")}
                      className={`relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-xl border bg-[#EDE4D5] p-1.5 ${
                        selected
                          ? "border-[#2D231F] ring-2 ring-[#2D231F]/15"
                          : "border-[#D9CDBE] hover:border-[#2D231F]"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                      <SelectedMark show={selected} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-[#D9CDBE] pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
            Độ trong suốt
          </span>
          <span className="text-xs tabular-nums text-[#2D231F]">
            {opacityPct}%
          </span>
        </div>
        <Slider
          value={opacityPct}
          onValueChange={(v) => onSetBackgroundOpacity(v / 100)}
        />
        <p className="text-[10px] leading-relaxed text-[#7A6A5C]/80">
          100% là nền đậm nhất. Giảm để nền nhạt hơn trên canvas.
        </p>
      </div>
    </div>
  );
}
