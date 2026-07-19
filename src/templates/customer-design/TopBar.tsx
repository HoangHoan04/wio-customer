import { PUBLIC_ROUTES } from "@/common/routes";
import {
  ArrowLeft,
  Check,
  Eye,
  Grid3x3,
  Monitor,
  PanelBottom,
  PanelLeftClose,
  PanelRightOpen,
  Pencil,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ZOOM_PRESETS = [25, 50, 75, 100, 150, 200];

interface Props {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish: () => void;
  onDeviceChange?: (device: { width: number; height: number }) => void;
  onOpenPreview?: (deviceType: string, deviceWidth: number, deviceHeight: number) => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  projectName?: string;
  onProjectNameChange?: (name: string) => void;
  showBottomBar?: boolean;
  onToggleBottomBar?: () => void;
  showLeftBar?: boolean;
  onToggleLeftBar?: () => void;
  showRightBar?: boolean;
  onToggleRightBar?: () => void;
}

const PREVIEW_DEVICES = [
  { id: "phone", label: "Điện thoại", icon: Smartphone, width: 440, height: 956 },
  { id: "tablet", label: "iPad", icon: Tablet, width: 1024, height: 1366 },
  { id: "desktop", label: "Desktop", icon: Monitor, width: 1920, height: 1080 },
] as const;

export default function TopBar({
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onOpenPreview,
  showGrid = false,
  onToggleGrid,
  projectName = "Thiết kế của tôi",
  onProjectNameChange,
  showBottomBar = true,
  onToggleBottomBar,
  showLeftBar = true,
  onToggleLeftBar,
  showRightBar = true,
  onToggleRightBar,
}: Props) {
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const zoomMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(e.target as Node)) {
        setShowZoomMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNameSubmit = () => {
    setEditingName(false);
    const trimmed = nameInput.trim();
    if (trimmed && onProjectNameChange) {
      onProjectNameChange(trimmed);
    } else {
      setNameInput(projectName);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNameSubmit();
    if (e.key === "Escape") {
      setEditingName(false);
      setNameInput(projectName);
    }
  };

  const handlePreviewDevice = (device: { id: string; width: number; height: number }) => {
    onOpenPreview?.(device.id, device.width, device.height);
    setShowPreviewModal(false);
  };

  return (
    <header className="h-14 bg-[#2a2a2a] border-b border-[#3a3a3a] flex items-center justify-between px-4 shrink-0 select-none gap-2 relative z-50">
      <style>{`
        @keyframes logoShimmer {
          0%   { text-shadow: 2px 4px 12px rgba(212,175,55,0.4); }
          50%  { text-shadow: 2px 4px 24px rgba(245,200,66,0.7), 0 0 40px rgba(212,175,55,0.3); }
          100% { text-shadow: 2px 4px 12px rgba(212,175,55,0.4); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .logo-shimmer {
          animation: logoShimmer 4s ease-in-out infinite;
        }
      `}</style>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => router.push(PUBLIC_ROUTES.HOME)}
          >
            <div className="flex flex-col leading-none">
              <span className="text-[clamp(1rem,3vw,1rem)] font-bold text-[#f5c842] whitespace-nowrap logo-shimmer">
                Tiệm cưới tân thời
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-[#3a3a3a] shrink-0" />

        {editingName ? (
          <div className="flex items-center gap-1">
            <input
              ref={nameInputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleNameKeyDown}
              className="bg-[#3a3a3a] text-white text-sm px-2 py-0.5 rounded border border-[#d4af37] outline-none w-44"
            />
            <button
              onClick={handleNameSubmit}
              className="p-1 text-gray-400 hover:text-white rounded"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setNameInput(projectName);
              setEditingName(true);
            }}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors max-w-45 group"
            title="Nhấp để đổi tên"
          >
            <span className="truncate">{projectName}</span>
            <Pencil size={12} className="text-gray-500 group-hover:text-gray-300 shrink-0" />
          </button>
        )}

        <div className="h-5 w-px bg-[#3a3a3a] shrink-0" />

        <a
          href={PUBLIC_ROUTES.HOME}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors shrink-0"
          title="Về trang chủ"
        >
          <ArrowLeft size={14} />
          Back
        </a>
      </div>

      <button
        onClick={() => setShowPreviewModal(true)}
        className="flex items-center gap-2 px-4 py-1.5 bg-[#d4af37] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5c04a] transition-colors"
      >
        <Eye size={16} />
        Xem trước
      </button>

      <div className="flex items-center gap-1 flex-1 justify-end">
        {onToggleLeftBar && (
          <button
            onClick={onToggleLeftBar}
            className={`p-1.5 rounded transition-colors ${showLeftBar
              ? "text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
              : "text-gray-600 bg-[#1a1a1a]"
              }`}
            title={showLeftBar ? "Ẩn thanh công cụ" : "Hiện thanh công cụ"}
          >
            <PanelLeftClose size={15} />
          </button>
        )}
        {onToggleRightBar && (
          <button
            onClick={onToggleRightBar}
            className={`p-1.5 rounded transition-colors ${showRightBar
              ? "text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
              : "text-gray-600 bg-[#1a1a1a]"
              }`}
            title={showRightBar ? "Ẩn panel phải" : "Hiện panel phải"}
          >
            <PanelRightOpen size={15} />
          </button>
        )}
        {onToggleBottomBar && (
          <button
            onClick={onToggleBottomBar}
            className={`p-1.5 rounded transition-colors ${showBottomBar
              ? "text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
              : "text-gray-600 bg-[#1a1a1a]"
              }`}
            title={showBottomBar ? "Ẩn thanh dưới" : "Hiện thanh dưới"}
          >
            <PanelBottom size={15} />
          </button>
        )}

        <div className="h-5 w-px bg-[#3a3a3a] mx-0.5" />

        {onToggleGrid && (
          <>
            <button
              onClick={onToggleGrid}
              className={`p-1.5 rounded transition-colors ${showGrid
                ? "bg-[#d4af37] text-[#1a1a1a]"
                : "text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                }`}
              title={showGrid ? "Ẩn lưới" : "Hiện lưới"}
            >
              <Grid3x3 size={15} />
            </button>
            <div className="h-5 w-px bg-[#3a3a3a] mx-0.5" />
          </>
        )}

        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 10))}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors"
          title="Thu nhỏ"
        >
          <ZoomOut size={15} />
        </button>

        <div className="relative" ref={zoomMenuRef}>
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="text-white text-xs w-12 text-center font-mono py-1 rounded hover:bg-[#3a3a3a] transition-colors"
            title="Chọn tỷ lệ zoom"
          >
            {zoom}%
          </button>
          {showZoomMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-xl py-1 min-w-20 z-50">
              {ZOOM_PRESETS.map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    onZoomChange(pct);
                    setShowZoomMenu(false);
                  }}
                  className={`w-full text-xs px-3 py-1.5 text-center transition-colors ${zoom === pct
                    ? "text-[#d4af37] bg-[rgba(212,175,55,0.1)]"
                    : "text-gray-300 hover:bg-[#3a3a3a]"
                    }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onZoomChange(Math.min(200, zoom + 10))}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors"
          title="Phóng to"
        >
          <ZoomIn size={15} />
        </button>

        <div className="h-5 w-px bg-[#3a3a3a] mx-0.5" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Làm lại (Ctrl+Shift+Z)"
        >
          <Redo2 size={15} />
        </button>

        <div className="h-5 w-px bg-[#3a3a3a] mx-0.5" />

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#3a3a3a] text-white text-xs rounded hover:bg-[#4a4a4a] transition-colors"
          title="Lưu (Ctrl+S)"
        >
          <Save size={13} />
          <span className="hidden sm:inline">Lưu (Tự động lưu sau 5 giây)</span>
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#d4af37] text-[#1a1a1a] text-xs font-bold rounded hover:bg-[#e5c04a] transition-colors"
          title="Xuất bản"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Xuất bản</span>
        </button>
      </div>

      {showPreviewModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl shadow-2xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-base font-semibold mb-4 text-center">
              Bạn muốn xem bằng:
            </h3>
            <div className="flex flex-col gap-2">
              {PREVIEW_DEVICES.map((device) => {
                const Icon = device.icon;
                return (
                  <button
                    key={device.id}
                    onClick={() => handlePreviewDevice(device)}
                    className="flex items-center gap-3 px-4 py-3 bg-[#202020] hover:bg-[#3a3a3a] rounded-xl text-white text-sm transition-colors"
                  >
                    <Icon size={20} className="text-[#d4af37]" />
                    <span>{device.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="mt-3 w-full py-2 text-gray-400 hover:text-white text-xs transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
