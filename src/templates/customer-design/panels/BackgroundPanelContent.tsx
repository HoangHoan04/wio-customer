import { uploadService } from "@/services/upload.service";
import Slider from "@/templates/customer-design/ui/Slider";
import Button from "@/templates/customer-design/ui/button/Button";
import tokenCache from "@/utils/token-cache";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function BackgroundPanelContent({
  canvasBackground,
  backgroundOpacity,
  bgType,
  onSetBackground,
  onSetBackgroundOpacity,
}: BackgroundPanelContentProps) {
  const [activeTab, setActiveTab] = useState<"color" | "image">(
    bgType || "color",
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bg_uploaded_images");
      if (saved) setUploadedImages(JSON.parse(saved));
    } catch {
      // ignore parse error
    }
  }, []);

  const persistImages = useCallback((imgs: UploadedItem[]) => {
    setUploadedImages(imgs);
    try {
      localStorage.setItem("bg_uploaded_images", JSON.stringify(imgs));
    } catch {
      // ignore storage error
    }
  }, []);

  const processFiles = useCallback(
    async (rawFiles: File[]) => {
      if (!tokenCache.isAuthenticated()) return;

      const imageFiles = rawFiles.filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      const filesToUpload = imageFiles.slice(0, 5);
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
            });
          }
        }
        if (results.length > 0) {
          persistImages([...results, ...uploadedImages]);
        }
      } catch {
        // ignore upload errors
      } finally {
        setLoading(false);
      }
    },
    [uploadedImages, persistImages],
  );

  const handleFilePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(Array.from(e.target.files));
      }
      e.target.value = "";
    },
    [processFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    },
    [processFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeImage = useCallback(
    (id: string) => {
      persistImages(uploadedImages.filter((img) => img.id !== id));
    },
    [uploadedImages, persistImages],
  );

  return (
    <div className="w-full max-w-sm text-[#f5e6d3] font-sans antialiased select-none overflow-hidden">
      <div className="flex border-b border-[#d4af37]/15 px-4">
        <button
          onClick={() => setActiveTab("color")}
          className={`flex-1 py-3 text-center font-bold text-sm transition-colors cursor-pointer ${
            activeTab === "color"
              ? "text-[#f5c842] border-b-2 border-[#d4af37]"
              : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"
          }`}
        >
          Màu nền
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 py-3 text-center font-bold text-sm transition-colors cursor-pointer ${
            activeTab === "image"
              ? "text-[#f5c842] border-b-2 border-[#d4af37]"
              : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"
          }`}
        >
          Hình nền
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
        {activeTab === "color" && (
          <>
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
                Màu nền hiện tại
              </span>
              <div className="flex items-center gap-4 bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-[#d4af37]/40 shadow-[0_0_10px_rgba(212,175,55,0.15)] shrink-0 relative overflow-hidden"
                  style={{
                    backgroundImage:
                      canvasBackground === "transparent"
                        ? "linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)"
                        : undefined,
                    backgroundSize:
                      canvasBackground === "transparent"
                        ? "8px 8px"
                        : undefined,
                    backgroundPosition:
                      canvasBackground === "transparent"
                        ? "0 0, 0 4px, 4px -4px, -4px 0"
                        : undefined,
                    backgroundColor:
                      canvasBackground === "transparent"
                        ? "#ffffff"
                        : undefined,
                    background:
                      canvasBackground !== "transparent"
                        ? canvasBackground
                        : undefined,
                  }}
                />

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] text-[#f5e6d3]/40 font-medium uppercase tracking-wide">
                    {canvasBackground.startsWith("linear-gradient")
                      ? "Gradient Color"
                      : canvasBackground.startsWith("http") ||
                          canvasBackground.startsWith("blob:")
                        ? "Wallpaper Image"
                        : "Solid Color"}
                  </span>
                  <span
                    className="text-xs font-mono font-bold text-[#f5c842] uppercase truncate select-all mt-0.5"
                    title={canvasBackground}
                  >
                    {canvasBackground === "transparent"
                      ? "TRANSPARENT (Trong suốt)"
                      : canvasBackground}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-bold text-[#f5e6d3] block">
                  Màu nền mặc định
                </span>
                <span className="text-xs text-[#f5e6d3]/40 block mt-0.5">
                  Màu đơn sắc
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2.5">
                {WEDDING_BG_COLORS.map((color) => {
                  const isSelected = canvasBackground === color;
                  const isTransparent = color === "transparent";

                  return (
                    <button
                      key={color}
                      onClick={() => onSetBackground(color, "color")}
                      className={`w-full aspect-square rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? "border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105 shadow-[0_0_8px_#d4af37]"
                          : "border-white/10 hover:border-[#d4af37]/40 hover:scale-105"
                      }`}
                      style={{
                        backgroundImage: isTransparent
                          ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                          : undefined,
                        backgroundSize: isTransparent ? "8px 8px" : undefined,
                        backgroundPosition: isTransparent
                          ? "0 0, 0 4px, 4px -4px, -4px 0"
                          : undefined,
                        backgroundColor: isTransparent ? "#ffffff" : color,
                      }}
                    >
                      {isTransparent && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-500 bg-white/60"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#f5e6d3]/40 uppercase tracking-wider block">
                Màu nền gradient
              </span>
              <div className="grid grid-cols-6 gap-2.5">
                {WEDDING_GRADIENT_COLORS.map((gradient) => {
                  const isSelected = canvasBackground === gradient;
                  return (
                    <button
                      key={gradient}
                      onClick={() => onSetBackground(gradient, "color")}
                      className={`w-full aspect-square rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105 shadow-[0_0_8px_#d4af37]"
                          : "border-white/10 hover:border-[#d4af37]/40 hover:scale-105"
                      }`}
                      style={{ background: gradient }}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === "image" && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer ${
                isDragging
                  ? "border-[#d4af37] bg-[#d4af37]/10"
                  : "border-white/10 hover:border-[#d4af37]/40 hover:bg-white/5"
              }`}
            >
              {loading ? (
                <Loader2 size={28} className="text-amber-400 animate-spin" />
              ) : (
                <>
                  <UploadCloud size={28} className="text-[#d4af37]/60" />
                  <span className="text-xs text-[#f5e6d3]/60 text-center">
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </span>
                  <Button
                    variant="outline"
                    className="w-full! py-1.5! bg-[#d4af37]/20! text-[#d4af37]! text-xs! rounded-lg hover:bg-[#d4af37]/30 transition-colors font-medium"
                  >
                    <ImagePlus size={14} />
                    Chọn ảnh
                  </Button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilePick}
                className="hidden"
              />
            </div>

            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
                  Ảnh đã tải lên
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((img) => {
                    const isSelected = canvasBackground === img.url;
                    return (
                      <div
                        key={img.id}
                        className="relative group aspect-square"
                      >
                        <button
                          onClick={() => onSetBackground(img.url, "image")}
                          className={`w-full h-full rounded-lg overflow-hidden border bg-black/30 bg-cover bg-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#d4af37] ring-2 ring-[#d4af37]/30"
                              : "border-white/5 hover:border-[#d4af37]/40"
                          }`}
                          style={{ backgroundImage: `url(${img.url})` }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(img.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
                Hình nền có sẵn
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SYSTEM_WALLPAPERS.map((imgUrl, index) => {
                  const isSelected = canvasBackground === imgUrl;
                  return (
                    <button
                      key={index}
                      onClick={() => onSetBackground(imgUrl, "image")}
                      className={`w-full aspect-square rounded-lg overflow-hidden border bg-black/30 bg-cover bg-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#d4af37] ring-2 ring-[#d4af37]/20"
                          : "border-white/5 hover:border-[#d4af37]/40 hover:scale-105"
                      }`}
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="px-4 pb-4 space-y-1 border-t border-[#d4af37]/15 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            Độ mờ nền
          </span>
          <span className="text-xs text-[#f5c842] font-mono">
            {Math.round(backgroundOpacity * 100)}%
          </span>
        </div>
        <Slider
          value={Math.round(backgroundOpacity * 100)}
          onValueChange={(v) => onSetBackgroundOpacity(v / 100)}
        />
      </div>
    </div>
  );
}
