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
  Scissors,
  UploadCloud,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import AudioTrimmerModal from "../components/AudioTrimmerModal";
import type { EditorElement, WidgetConfig } from "../types";

interface AudioItem {
  id: string;
  name: string;
  url?: string;
  duration: string;
  source?: "admin" | "user";
  status?: string;
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
  const [userLibrary, setUserLibrary] = useState<AudioItem[]>([]);
  const [userLibLoading, setUserLibLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [uploadLoading, setUploadLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeImportLoading, setYoutubeImportLoading] = useState(false);
  const [youtubePreview, setYoutubePreview] = useState<{
    title: string;
    author: string;
    duration: string;
    thumbnailUrl?: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [youtubeImports, setYoutubeImports] = useState<{
    id: string;
    name: string;
    youtubeUrl: string;
    status: "PROCESSING" | "FAILED";
    createdAt: number;
  }[]>([]);

  const existingWidget = elements.find(
    (el) => el.type === "widget" && el.widgetType === "music" && el.widgetConfig?.audioEnabled
  );
  const [iconId, setIconId] = useState(existingWidget?.widgetConfig?.iconId || "music-1");
  const [iconColor, setIconColor] = useState(existingWidget?.widgetConfig?.color || "#b6cc61");
  const [trimmingSong, setTrimmingSong] = useState<AudioItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = useCallback(
    (song: AudioItem) => {
      if (!song.url) return;

      if (selectedAudio?.id === song.id) {
        window.dispatchEvent(new CustomEvent("wio-toggle-canvas-audio"));
        return;
      }

      if (previewingId === song.id) {
        previewAudioRef.current?.pause();
        window.dispatchEvent(new CustomEvent("wio-preview-audio-stop"));
        setPreviewingId(null);
      } else {
        if (previewAudioRef.current) {
          previewAudioRef.current.pause();
        }

        const audio = new Audio(song.url);
        audio.onended = () => {
          setPreviewingId(null);
          window.dispatchEvent(new CustomEvent("wio-preview-audio-stop"));
        };

        window.dispatchEvent(new CustomEvent("wio-preview-audio-start"));

        audio.play().catch(() => {
          window.dispatchEvent(new CustomEvent("wio-preview-audio-stop"));
        });

        previewAudioRef.current = audio;
        setPreviewingId(song.id);
      }
    },
    [previewingId, selectedAudio]
  );

  useEffect(() => {
    const handleCanvasAudioStatus = (e: Event) => {
      const customEvent = e as CustomEvent;
      const isCanvasPlaying = customEvent.detail?.isPlaying;

      if (selectedAudio) {
        if (isCanvasPlaying) {
          setPreviewingId(selectedAudio.id);
        } else {
          setPreviewingId((prev) => (prev === selectedAudio.id ? null : prev));
        }
      }
    };

    window.addEventListener("wio-canvas-audio-status", handleCanvasAudioStatus);
    return () => {
      window.removeEventListener("wio-canvas-audio-status", handleCanvasAudioStatus);
    };
  }, [selectedAudio]);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        window.dispatchEvent(new CustomEvent("wio-preview-audio-stop"));
      }
    };
  }, []);

  const fetchLibrary = useCallback(() => {
    setLibLoading(true);
    setUserLibLoading(true);

    musicBackgroundService
      .getMusics({ where: { type: "admin" } })
      .then((res: any) => {
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const mapped = items.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || "Unknown",
          url: item.audioUrl || item.fileUrl || "",
          duration: item.duration || "3:00",
          source: "admin" as const,
          status: item.status || "",
          youtubeUrl: item.youtubeUrl || "",
        }));
        setLibrary(mapped);
      })
      .catch(() => {
        setLibrary([]);
      })
      .finally(() => setLibLoading(false));

    musicBackgroundService
      .getMusics({ where: { type: "user" } })
      .then((res: any) => {
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const mapped = items.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || "Unknown",
          url: item.audioUrl || item.fileUrl || "",
          duration: item.duration || "3:00",
          source: "user" as const,
          status: item.status || "",
          youtubeUrl: item.youtubeUrl || "",
        }));
        setUserLibrary(mapped);

        setYoutubeImports((prev) => {
          let changed = false;
          const updated = prev.filter((imp) => {
            const found = mapped.find(
              (m: any) =>
                m.youtubeUrl &&
                (m.youtubeUrl.trim() === imp.youtubeUrl.trim() ||
                  m.youtubeUrl.includes(imp.youtubeUrl) ||
                  imp.youtubeUrl.includes(m.youtubeUrl))
            );
            if (found) {
              changed = true;
              return false; 
            }
            if (imp.status === "PROCESSING" && Date.now() - imp.createdAt > 600000) {
              imp.status = "FAILED";
              changed = true;
            }
            return true;
          });
          if (changed) {
            localStorage.setItem("wio_youtube_imports", JSON.stringify(updated));
            return [...updated];
          }
          return prev;
        });
      })
      .catch(() => {
        setUserLibrary([]);
      })
      .finally(() => setUserLibLoading(false));
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  useEffect(() => {
    const hasProcessing = youtubeImports.some((s) => s.status === "PROCESSING");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchLibrary();
    }, 8000);

    return () => clearInterval(interval);
  }, [youtubeImports, fetchLibrary]);

  useEffect(() => {
    try {
      const savedImports = localStorage.getItem("wio_youtube_imports");
      if (savedImports) setYoutubeImports(JSON.parse(savedImports));
    } catch {
      //! ignore parse error
    }
  }, []);


  const filteredLibrary = library.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseSong = useCallback(
    (song: AudioItem) => {
      previewAudioRef.current?.pause();
      window.dispatchEvent(new CustomEvent("wio-preview-audio-stop"));
      setPreviewingId(null);
      if (selectedAudio?.id === song.id) {
        onSelectAudio(null);
        onUpdateWidgetConfig("music", false);
      } else {
        onSelectAudio(song);
        onUpdateWidgetConfig("music", true, {
          audioEnabled: true,
          audioUrl: song.url,
          songTitle: song.name,
          audioSource: song.source,
        });
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
        const res = await uploadService.uploadAudio(file);
        const url = res?.fileUrl;
        if (url) {
          const name = file.name.replace(/\.[^/.]+$/, "");

          const savedSong = await musicBackgroundService.createUserMusic({
            name,
            audioUrl: url,
            author: "Nhạc tải lên",
            duration: "—"
          });

          fetchLibrary();

          const audioItem: AudioItem = {
            id: savedSong.id,
            name: savedSong.name,
            url: savedSong.audioUrl,
            duration: savedSong.duration || "—",
            source: "user",
          };

          handleUseSong(audioItem);
        }
      } catch (err) {
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
    [handleUseSong, fetchLibrary, showToast]
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

  const handleFetchYoutubeInfo = useCallback(async () => {
    if (!youtubeUrl.trim()) return;
    setPreviewLoading(true);
    setYoutubePreview(null);
    try {
      const info = await musicBackgroundService.getYoutubeInfo(youtubeUrl);
      if (info) {
        setYoutubePreview({
          title: info.title || "YouTube Video",
          author: info.author || "Unknown Uploader",
          duration: info.duration || info.durationText || "3:00",
          thumbnailUrl: info.thumbnailUrl || info.thumbnail || "",
        });
      }
    } catch (err: any) {
      showToast({
        title: "Lỗi",
        message: err.response?.data?.message || "Không thể lấy thông tin video",
        type: "error",
        timeout: 3000,
      });
    } finally {
      setPreviewLoading(false);
    }
  }, [youtubeUrl, showToast]);

  const handleImportYoutube = useCallback(async () => {
    if (!youtubeUrl.trim() || !youtubePreview) return;
    setYoutubeImportLoading(true);
    try {
      await musicBackgroundService.importYoutube(youtubeUrl);
      showToast({
        title: "Đã gửi yêu cầu",
        message: "Hệ thống đang tải nhạc từ YouTube, vui lòng chờ...",
        type: "success",
        timeout: 3000,
      });

      const newImport = {
        id: `yt-import-${Date.now()}`,
        name: youtubePreview.title,
        youtubeUrl: youtubeUrl.trim(),
        status: "PROCESSING" as const,
        createdAt: Date.now(),
      };

      const nextImports = [newImport, ...youtubeImports];
      setYoutubeImports(nextImports);
      localStorage.setItem("wio_youtube_imports", JSON.stringify(nextImports));

      setYoutubeUrl("");
      setYoutubePreview(null);
      fetchLibrary();
    } catch (err: any) {
      showToast({
        title: "Lỗi",
        message: err.response?.data?.message || "Không thể yêu cầu nhập nhạc từ YouTube",
        type: "error",
        timeout: 3000,
      });
    } finally {
      setYoutubeImportLoading(false);
    }
  }, [youtubeUrl, youtubePreview, youtubeImports, fetchLibrary, showToast]);

  const handleCancelImport = useCallback(async (url: string, id: string) => {
    try {
      await musicBackgroundService.cancelImport(url);

      const next = youtubeImports.filter((x) => x.id !== id);
      setYoutubeImports(next);
      localStorage.setItem("wio_youtube_imports", JSON.stringify(next));

      showToast({
        title: "Đã hủy",
        message: "Đã hủy tải bài hát từ YouTube",
        type: "success",
        timeout: 3000,
      });
    } catch (err: any) {
      showToast({
        title: "Lỗi",
        message: err.response?.data?.message || "Không thể hủy tải bài hát",
        type: "error",
        timeout: 3000,
      });
    }
  }, [youtubeImports, showToast]);

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
    <div className="w-full font-sans text-[#2D231F] space-y-4 pb-6">
      <style>{`
        @keyframes wio-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
      <div className="flex border-b border-[#D9CDBE]">
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 text-center pb-2.5 text-sm font-medium transition-colors relative ${activeTab === "library"
            ? "text-amber-400 font-semibold"
            : "text-[#7A6A5C] hover:text-[#2D231F]"
            }`}
        >
          Thư viện nhạc
          {activeTab === "library" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("my-music")}
          className={`flex-1 text-center pb-2.5 text-sm font-medium transition-colors relative ${activeTab === "my-music"
            ? "text-amber-400 font-semibold"
            : "text-[#7A6A5C] hover:text-[#2D231F]"
            }`}
        >
          Nhạc của tôi
          {activeTab === "my-music" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      <div className="bg-[#F3EDE3]/40 border border-[#D9CDBE] rounded-2xl p-4 text-center">
        <p className="text-xs text-[#7A6A5C]/70 uppercase tracking-wider mb-1">Nhạc hiện tại</p>
        {selectedAudio ? (
          <div className="flex items-center justify-center gap-2 overflow-hidden w-full max-w-64 mx-auto">
            <Disc size={14} className="animate-spin text-amber-500 shrink-0" />
            {selectedAudio.name.length > 18 ? (
              <div className="w-36 overflow-hidden relative flex-1 text-left">
                <div
                  className="inline-block whitespace-nowrap text-sm text-amber-400 font-medium"
                  style={{
                    animation: "wio-marquee 8s linear infinite",
                    paddingLeft: "100%",
                  }}
                >
                  {selectedAudio.name}
                </div>
              </div>
            ) : (
              <span className="text-sm text-amber-400 font-medium truncate max-w-40 flex-1">
                {selectedAudio.name}
              </span>
            )}
            <button
              onClick={handleRemoveMusic}
              className="text-[#7A6A5C]/50 hover:text-red-400 transition-colors shrink-0"
              title="Bỏ chọn nhạc"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#7A6A5C] font-medium">Chưa chọn bài hát nào</p>
        )}
      </div>

      {activeTab === "library" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6A5C]/70" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm bài hát..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3EDE3] border border-[#D9CDBE] rounded-xl pl-9 pr-4 py-2 text-sm text-[#2D231F] placeholder-[#7A6A5C]/50 outline-hidden focus:border-zinc-700 transition-all"
            />
          </div>
          <div className="max-h-75 overflow-y-auto border border-zinc-900 bg-[#F3EDE3]/10 rounded-xl divide-y divide-zinc-800/60 custom-scrollbar">
            {libLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-amber-400 animate-spin" />
              </div>
            ) : filteredLibrary.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#7A6A5C]/50">
                {searchQuery ? "Không tìm thấy bài hát" : "Thư viện nhạc trống"}
              </div>
            ) : (
              filteredLibrary.map((song) => (
                <div
                  key={song.id}
                  className="flex flex-col items-stretch gap-2 py-2.5 px-3 hover:bg-[#F3EDE3]/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(song);
                      }}
                      className="w-7 h-7 rounded-full bg-[#F3EDE3] flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0"
                    >
                      {previewingId === song.id ? (
                        <Pause size={12} fill="currentColor" />
                      ) : (
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 justify-between">
                        {song.name.length > 22 ? (
                          <div className="w-36 overflow-hidden relative">
                            <div 
                              className="inline-block whitespace-nowrap text-xs font-medium text-[#2D231F]"
                              style={{
                                animation: "wio-marquee 8s linear infinite",
                                paddingLeft: "100%",
                              }}
                            >
                              {song.name}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-[#2D231F] truncate max-w-36">{song.name}</p>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrimmingSong(song);
                          }}
                          className="text-[#7A6A5C]/70 hover:text-amber-400 transition-colors p-1 shrink-0"
                          title="Cắt nhạc"
                        >
                          <Scissors size={12} />
                        </button>
                      </div>
                      {song.duration && (
                        <p className="text-[10px] text-[#7A6A5C]/70 mt-0.5">{song.duration}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleUseSong(song)}
                    variant="secondary"
                    buttonSize="sm"
                    className="py-1! px-3! h-8! w-full! text-xs font-medium z-10 relative"
                  >
                    {selectedAudio?.id === song.id ? "Đang dùng" : "Sử dụng"}
                  </Button>
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
                <span className="text-xs text-[#7A6A5C]/70 text-center">
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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6A5C]/70" />
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Dán link YouTube..."
                  className="w-full bg-[#F3EDE3] border border-[#D9CDBE] rounded-xl pl-9 pr-3 py-2 text-sm text-[#2D231F] placeholder-[#7A6A5C]/50 outline-hidden focus:border-zinc-700"
                />
              </div>
              <button
                onClick={handleFetchYoutubeInfo}
                disabled={previewLoading || !youtubeUrl.trim()}
                className="px-3 py-2 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-xl border border-amber-800/40 hover:bg-amber-500/30 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {previewLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Xem trước"
                )}
              </button>
            </div>

            {youtubePreview && (
              <div className="bg-[#F3EDE3]/80 border border-[#D9CDBE] rounded-xl p-3 space-y-3">
                <div className="flex gap-3">
                  {youtubePreview.thumbnailUrl && (
                    <img
                      src={youtubePreview.thumbnailUrl}
                      alt={youtubePreview.title}
                      className="w-20 aspect-video object-cover rounded-lg bg-zinc-950 shrink-0 border border-[#D9CDBE]"
                    />
                  )}
                  <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-xs font-semibold text-[#2D231F] line-clamp-1">
                        {youtubePreview.title}
                      </p>
                      <p className="text-[10px] text-[#7A6A5C] mt-1 truncate">
                        {youtubePreview.author}
                      </p>
                    </div>
                    <p className="text-[10px] text-amber-400 font-mono">
                      Thời lượng: {youtubePreview.duration}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleImportYoutube}
                    disabled={youtubeImportLoading}
                    className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-800/40 text-emerald-400 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {youtubeImportLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Xác nhận Import"
                    )}
                  </button>
                  <button
                    onClick={() => setYoutubePreview(null)}
                    disabled={youtubeImportLoading}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>

          {youtubeImports.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#D9CDBE]/60">
              <p className="text-[10px] text-[#7A6A5C]/70 uppercase tracking-wider">Đang xử lý từ YouTube</p>
              <div className="space-y-1">
                {youtubeImports.map((imp) => (
                  <div
                    key={imp.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F3EDE3]/30 border border-[#D9CDBE]/40"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-xs text-zinc-300 truncate">{imp.name}</p>
                      <p className="text-[9px] text-[#7A6A5C]/70 mt-0.5 truncate">{imp.youtubeUrl}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {imp.status === "PROCESSING" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[10px] text-amber-500">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Đang tải...</span>
                          </div>
                          <button
                            onClick={() => handleCancelImport(imp.youtubeUrl, imp.id)}
                            className="p-1 hover:bg-zinc-800 text-[#7A6A5C] hover:text-red-400 rounded transition-colors"
                            title="Hủy tải lên"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-red-400">Lỗi</span>
                          <button
                            onClick={() => {
                              setYoutubeUrl(imp.youtubeUrl);
                              setTimeout(() => {
                                handleFetchYoutubeInfo();
                              }, 100);
                              const next = youtubeImports.filter((x) => x.id !== imp.id);
                              setYoutubeImports(next);
                              localStorage.setItem("wio_youtube_imports", JSON.stringify(next));
                            }}
                            className="text-[10px] px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300 transition-colors"
                          >
                            Thử lại
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {userLibLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-amber-400 animate-spin" />
            </div>
          ) : userLibrary.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#7A6A5C]/50">
              Chưa có nhạc cá nhân nào được tải lên
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-[10px] text-[#7A6A5C]/70 uppercase tracking-wider">Nhạc cá nhân của bạn</p>
              <div className="max-h-60 overflow-y-auto border border-zinc-900 bg-[#F3EDE3]/10 rounded-xl divide-y divide-zinc-800/60 custom-scrollbar">
                {userLibrary.map((song) => (
                  <div
                    key={song.id}
                    className="flex flex-col items-stretch gap-2 py-2.5 px-3 hover:bg-[#F3EDE3]/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(song);
                        }}
                        className="w-7 h-7 rounded-full bg-[#F3EDE3] flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0"
                      >
                        {previewingId === song.id ? (
                          <Pause size={12} fill="currentColor" />
                        ) : (
                          <Play size={12} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 justify-between">
                          {song.name.length > 22 ? (
                            <div className="w-36 overflow-hidden relative">
                              <div 
                                className="inline-block whitespace-nowrap text-xs font-medium text-[#2D231F]"
                                style={{
                                  animation: "wio-marquee 8s linear infinite",
                                  paddingLeft: "100%",
                                }}
                              >
                                {song.name}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-[#2D231F] truncate max-w-36">{song.name}</p>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTrimmingSong(song);
                            }}
                            className="text-[#7A6A5C]/70 hover:text-amber-400 transition-colors p-1 shrink-0"
                            title="Cắt nhạc"
                          >
                            <Scissors size={12} />
                          </button>
                        </div>
                        {song.duration && (
                          <p className="text-[10px] text-[#7A6A5C]/70 mt-0.5">{song.duration}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUseSong(song)}
                      variant="secondary"
                      buttonSize="sm"
                      className="py-1! px-3! h-8! w-full! text-xs font-medium z-10 relative"
                    >
                      {selectedAudio?.id === song.id ? "Đang dùng" : "Sử dụng"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="space-y-3 pt-2 border-t border-[#D9CDBE]">
        <div>
          <label className="text-[10px] text-[#7A6A5C]/70 uppercase tracking-wider block mb-2">
            Biểu tượng nhạc
          </label>
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((ic) => {
              const LucidIcon = ic.icon;
              return (
                <button
                  key={ic.id}
                  onClick={() => handleIconChange(ic.id)}
                  className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${iconId === ic.id
                    ? "border-amber-400 bg-amber-500/10 text-amber-400 ring-1 ring-amber-400/30"
                    : "border-[#D9CDBE] bg-[#F3EDE3] text-[#7A6A5C] hover:border-zinc-700"
                    }`}
                >
                  <LucidIcon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#7A6A5C]/70 uppercase tracking-wider block mb-2">
            Màu biểu tượng
          </label>
          <ColorPickerRow value={iconColor} onChange={handleColorChange} />
        </div>
      </div>

      {trimmingSong && (
        <AudioTrimmerModal
          song={trimmingSong}
          onClose={() => setTrimmingSong(null)}
          onSuccess={() => {
            fetchLibrary();
          }}
        />
      )}
    </div>
  );
}
