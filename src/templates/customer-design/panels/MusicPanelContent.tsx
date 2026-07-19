import Button from "@/templates/customer-design/ui/button/Button";
import { useToast } from "@/hooks/useToast";
import { musicBackgroundService } from "@/services/music-background.service";
import { uploadService } from "@/services/upload.service";
import tokenCache from "@/utils/token-cache";
import {
  Disc,
  Headphones,
  ImagePlus,
  Link2,
  Loader2,
  Music,
  Music2,
  Music3,
  Music4,
  Pause,
  Play,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import type { EditorElement, WidgetConfig } from "../types";

interface AudioItem {
  id: string;
  name: string;
  url?: string;
  duration: string;
  source?: "admin" | "user";
}

interface UploadedAudio {
  id: string;
  name: string;
  url: string;
}

interface MusicPanelContentProps {
  elements: EditorElement[];
  selectedAudio: AudioItem | null;
  onSelectAudio: (audio: AudioItem | null) => void;
  onUpdateWidgetConfig: (
    widgetType: "music",
    enabled: boolean,
    updates?: Partial<WidgetConfig>
  ) => void;
}

type TabType = "library" | "my-music";

const ICONS = [
  { id: "music-1", icon: Music },
  { id: "music-2", icon: Music2 },
  { id: "music-3", icon: Music3 },
  { id: "music-4", icon: Music4 },
  { id: "headphones", icon: Headphones },
  { id: "disc", icon: Disc },
];

export default function MusicPanelContent({
  elements,
  selectedAudio,
  onSelectAudio,
  onUpdateWidgetConfig,
}: MusicPanelContentProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("library");

  const [library, setLibrary] = useState<AudioItem[]>([]);
  const [libLoading, setLibLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [uploadedAudios, setUploadedAudios] = useState<UploadedAudio[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const existingWidget = elements.find(
    (el) => el.type === "widget" && el.widgetType === "music" && el.widgetConfig?.audioEnabled
  );
  const [iconId, setIconId] = useState(existingWidget?.widgetConfig?.iconId || "music-1");
  const [iconColor, setIconColor] = useState(existingWidget?.widgetConfig?.color || "#d4af37");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = useCallback(
    (song: AudioItem) => {
      if (!song.url) return;
      if (previewingId === song.id) {
        previewAudioRef.current?.pause();
        setPreviewingId(null);
      } else {
        previewAudioRef.current?.pause();
        const audio = new Audio(song.url);
        audio.onended = () => setPreviewingId(null);
        audio.play().catch(() => {});
        previewAudioRef.current = audio;
        setPreviewingId(song.id);
      }
    },
    [previewingId]
  );

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    setLibLoading(true);
    musicBackgroundService
      .getMusics()
      .then((res: any) => {
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const mapped = items.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || "Unknown",
          url: item.audioUrl || item.fileUrl || "",
          duration: item.duration || "3:00",
          source: "admin" as const,
        }));
        setLibrary(mapped);
      })
      .catch(() => {
        setLibrary([]);
      })
      .finally(() => setLibLoading(false));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("my_audios");
      if (saved) setUploadedAudios(JSON.parse(saved));
    } catch {
      // ignore parse error
    }
  }, []);

  const persistAudios = useCallback((list: UploadedAudio[]) => {
    setUploadedAudios(list);
    try {
      localStorage.setItem("my_audios", JSON.stringify(list));
    } catch {
      // ignore storage error
    }
  }, []);

  const filteredLibrary = library.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseSong = useCallback(
    (song: AudioItem) => {
      previewAudioRef.current?.pause();
      setPreviewingId(null);
      if (selectedAudio?.id === song.id) {
        onSelectAudio(null);
        onUpdateWidgetConfig("music", false);
      } else {
        onSelectAudio(song);
        showToast({
          title: "Đã chọn bài hát",
          message: `Đang sử dụng: ${song.name}`,
          type: "success",
          timeout: 2000,
        });
      }
    },
    [selectedAudio, onSelectAudio, onUpdateWidgetConfig, showToast]
  );

  const handleRemoveMusic = useCallback(() => {
    onUpdateWidgetConfig("music", false);
  }, [onUpdateWidgetConfig]);

  const handleUploadAudio = useCallback(
    async (file: File) => {
      if (!tokenCache.isAuthenticated()) return;
      if (!file.type.startsWith("audio/")) {
        showToast({
          title: "Không hợp lệ",
          message: "Chỉ chấp nhận file audio",
          type: "error",
          timeout: 2500,
        });
        return;
      }
      setUploadLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadService.uploadAudio(file);
        const url = res?.fileUrl;
        if (url) {
          const newItem: UploadedAudio = {
            id: `user-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url,
          };
          persistAudios([newItem, ...uploadedAudios]);

          const audioItem: AudioItem = {
            id: newItem.id,
            name: newItem.name,
            url: newItem.url,
            duration: "",
            source: "user",
          };
          handleUseSong(audioItem);
        }
      } catch {
        showToast({
          title: "Lỗi",
          message: "Không thể tải audio lên",
          type: "error",
          timeout: 2500,
        });
      } finally {
        setUploadLoading(false);
      }
    },
    [uploadedAudios, persistAudios, handleUseSong, showToast]
  );

  const handleFilePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) handleUploadAudio(e.target.files[0]);
      e.target.value = "";
    },
    [handleUploadAudio]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("audio/"));
        if (file) handleUploadAudio(file);
      }
    },
    [handleUploadAudio]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleImportYoutube = useCallback(() => {
    if (!youtubeUrl.trim()) return;
    showToast({
      title: "Đang phát triển",
      message: "Tính năng nhập nhạc từ YouTube đang được phát triển",
      type: "info",
      timeout: 3000,
    });
    setYoutubeUrl("");
  }, [youtubeUrl, showToast]);

  const handleRemoveUploaded = useCallback(
    (id: string) => {
      persistAudios(uploadedAudios.filter((a) => a.id !== id));
    },
    [uploadedAudios, persistAudios]
  );

  const handleIconChange = useCallback(
    (id: string) => {
      setIconId(id);
      if (existingWidget) {
        onUpdateWidgetConfig("music", true, { iconId: id });
      }
    },
    [existingWidget, onUpdateWidgetConfig]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setIconColor(color);
      if (existingWidget) {
        onUpdateWidgetConfig("music", true, { color });
      }
    },
    [existingWidget, onUpdateWidgetConfig]
  );

  return (
    <div className="w-full font-sans text-zinc-100 space-y-4 pb-6">
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 text-center pb-2.5 text-sm font-medium transition-colors relative ${
            activeTab === "library"
              ? "text-amber-400 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Thư viện nhạc
          {activeTab === "library" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("my-music")}
          className={`flex-1 text-center pb-2.5 text-sm font-medium transition-colors relative ${
            activeTab === "my-music"
              ? "text-amber-400 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Nhạc của tôi
          {activeTab === "my-music" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Nhạc hiện tại</p>
        {selectedAudio ? (
          <div className="flex items-center justify-center gap-2">
            <Disc size={14} className="animate-spin text-amber-500 shrink-0" />
            <span className="text-sm text-amber-400 font-medium truncate max-w-50">
              {selectedAudio.name}
            </span>
            <button
              onClick={handleRemoveMusic}
              className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
              title="Bỏ chọn nhạc"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 font-medium">Chưa chọn bài hát nào</p>
        )}
      </div>

      {activeTab === "library" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm bài hát..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-hidden focus:border-zinc-700 transition-all"
            />
          </div>
          <div className="max-h-75 overflow-y-auto border border-zinc-900 bg-zinc-900/10 rounded-xl divide-y divide-zinc-800/60 custom-scrollbar">
            {libLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-amber-400 animate-spin" />
              </div>
            ) : filteredLibrary.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-600">
                {searchQuery ? "Không tìm thấy bài hát" : "Thư viện nhạc trống"}
              </div>
            ) : (
              filteredLibrary.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-zinc-900/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(song);
                      }}
                      className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0"
                    >
                      {previewingId === song.id ? (
                        <Pause size={12} fill="currentColor" />
                      ) : (
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-200 truncate">{song.name}</p>
                      {song.duration && (
                        <p className="text-[10px] text-zinc-500 mt-0.5">{song.duration}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseSong(song)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                      selectedAudio?.id === song.id
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    {selectedAudio?.id === song.id ? "Đang dùng" : "Sử dụng"}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "my-music" && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 p-5 transition-all cursor-pointer hover:border-amber-400/40 hover:bg-white/5"
          >
            {uploadLoading ? (
              <Loader2 size={24} className="text-amber-400 animate-spin" />
            ) : (
              <>
                <UploadCloud size={24} className="text-amber-400/60" />
                <span className="text-xs text-zinc-500 text-center">
                  Kéo thả file audio hoặc click để chọn
                </span>
                <Button
                  variant="outline"
                  className="w-full! py-1.5! bg-amber-500/20! text-amber-400! text-xs! rounded-lg hover:bg-amber-500/30! font-medium"
                >
                  <ImagePlus size={14} />
                  Chọn file audio
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFilePick}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Dán link YouTube..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-hidden focus:border-zinc-700"
              />
            </div>
            <button
              onClick={handleImportYoutube}
              className="px-3 py-2 bg-red-600/20 text-red-400 text-xs font-medium rounded-xl border border-red-800/40 hover:bg-red-600/30 transition-colors whitespace-nowrap"
            >
              Import
            </button>
          </div>

          {uploadedAudios.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Đã tải lên</p>
              <div className="max-h-50 overflow-y-auto space-y-1 custom-scrollbar">
                {uploadedAudios.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Music size={14} className="text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-300 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleUseSong({
                            id: item.id,
                            name: item.name,
                            url: item.url,
                            duration: "",
                            source: "user",
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          selectedAudio?.id === item.id
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        {selectedAudio?.id === item.id ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button
                        onClick={() => handleRemoveUploaded(item.id)}
                        className="p-1 text-red-400 hover:text-red-700 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">
            Biểu tượng nhạc
          </label>
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((ic) => {
              const LucidIcon = ic.icon;
              return (
                <button
                  key={ic.id}
                  onClick={() => handleIconChange(ic.id)}
                  className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${
                    iconId === ic.id
                      ? "border-amber-400 bg-amber-500/10 text-amber-400 ring-1 ring-amber-400/30"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <LucidIcon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">
            Màu biểu tượng
          </label>
          <ColorPickerRow value={iconColor} onChange={handleColorChange} />
        </div>
      </div>
    </div>
  );
}
