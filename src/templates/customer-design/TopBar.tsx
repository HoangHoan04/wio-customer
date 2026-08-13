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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onOpenPreview?: (
    deviceType: string,
    deviceWidth: number,
    deviceHeight: number,
  ) => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  gridType?: "lines" | "dots";
  onGridTypeChange?: (type: "lines" | "dots") => void;
  gridSize?: number;
  onGridSizeChange?: (size: number) => void;
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
  {
    id: "phone",
    label: "Điện thoại",
    icon: Smartphone,
    width: 440,
    height: 956,
  },
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
  gridType = "lines",
  onGridTypeChange,
  gridSize = 40,
  onGridSizeChange,
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
      if (
        zoomMenuRef.current &&
        !zoomMenuRef.current.contains(e.target as Node)
      ) {
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

  const handlePreviewDevice = (device: {
    id: string;
    width: number;
    height: number;
  }) => {
    onOpenPreview?.(device.id, device.width, device.height);
    setShowPreviewModal(false);
  };

  return (
    <header className="h-14 bg-[#EDE4D5] border-b border-[#D9CDBE] flex items-center justify-between px-4 shrink-0 select-none gap-2 relative z-50">
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => router.push(PUBLIC_ROUTES.HOME)}
          >
            <div className="flex flex-col leading-none">
              <span className="text-[clamp(1rem,3vw,1rem)] font-bold text-[#2D231F] whitespace-nowrap">
                InviGo
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-[#D9CDBE] shrink-0" />

        {editingName ? (
          <div className="flex items-center gap-1">
            <input
              ref={nameInputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleNameKeyDown}
              className="bg-[#D9CDBE] text-[#2D231F] text-sm px-2 py-0.5 rounded border border-[#2D231F] outline-none w-44"
            />
            <button
              onClick={handleNameSubmit}
              className="p-1 text-[#7A6A5C] hover:text-[#2D231F] rounded"
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
            className="flex items-center gap-1.5 text-[#7A6A5C] hover:text-[#2D231F] text-sm transition-colors max-w-45 group"
            title="Nhấp để đổi tên"
          >
            <span className="truncate">{projectName}</span>
            <Pencil
              size={12}
              className="text-[#7A6A5C]/70 group-hover:text-[#7A6A5C] shrink-0"
            />
          </button>
        )}

        <div className="h-5 w-px bg-[#D9CDBE] shrink-0" />

        <a
          href={PUBLIC_ROUTES.HOME}
          className="flex items-center gap-1 text-[#7A6A5C]/70 hover:text-[#7A6A5C] text-xs transition-colors shrink-0"
          title="Về trang chủ"
        >
          <ArrowLeft size={14} />
          Back
        </a>
      </div>

      <button
        onClick={() => onOpenPreview?.("phone", 440, 956)}
        className="flex items-center gap-2 px-4 py-1.5 bg-[#2D231F] text-[#F3EDE3] text-sm font-semibold rounded-lg hover:opacity-90 transition-colors"
      >
        <Eye size={16} />
        Xem trước
      </button>

      <div className="flex items-center gap-1 flex-1 justify-end">
        {onToggleLeftBar && (
          <button
            onClick={onToggleLeftBar}
            className={`p-1.5 rounded transition-colors ${
              showLeftBar
                ? "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
                : "text-[#7A6A5C]/60 bg-[#F3EDE3]"
            }`}
            title={showLeftBar ? "Ẩn thanh công cụ" : "Hiện thanh công cụ"}
          >
            <PanelLeftClose size={15} />
          </button>
        )}
        {onToggleRightBar && (
          <button
            onClick={onToggleRightBar}
            className={`p-1.5 rounded transition-colors ${
              showRightBar
                ? "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
                : "text-[#7A6A5C]/60 bg-[#F3EDE3]"
            }`}
            title={showRightBar ? "Ẩn panel phải" : "Hiện panel phải"}
          >
            <PanelRightOpen size={15} />
          </button>
        )}
        {onToggleBottomBar && (
          <button
            onClick={onToggleBottomBar}
            className={`p-1.5 rounded transition-colors ${
              showBottomBar
                ? "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
                : "text-[#7A6A5C]/60 bg-[#F3EDE3]"
            }`}
            title={showBottomBar ? "Ẩn thanh dưới" : "Hiện thanh dưới"}
          >
            <PanelBottom size={15} />
          </button>
        )}

        <div className="h-5 w-px bg-[#D9CDBE] mx-0.5" />

        {onToggleGrid && (
          <>
            <Popover>
              <PopoverTrigger
                className={`p-1.5 rounded transition-colors ${
                  showGrid
                    ? "bg-[#2D231F] text-[#F3EDE3]"
                    : "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
                }`}
                title="Cấu hình lưới"
              >
                <Grid3x3 size={15} />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-50 bg-[#EDE4D5] border border-[#D9CDBE] rounded-lg shadow-xl p-3 flex flex-col gap-3">
                <div className="text-[10px] font-bold text-[#7A6A5C]/70 uppercase tracking-wider">
                  Cấu hình lưới
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#D9CDBE] pb-2">
                  <span className="text-[#7A6A5C] text-xs font-medium">Bật lưới:</span>
                  <button
                    onClick={onToggleGrid}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showGrid ? "bg-[#2D231F]" : "bg-[#D9CDBE]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        showGrid ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7A6A5C] text-xs">Loại lưới:</label>
                  <Select
                    value={gridType}
                    onValueChange={(val) => onGridTypeChange?.(val as "lines" | "dots")}
                    disabled={!showGrid}
                  >
                    <SelectTrigger className="h-8 text-xs bg-[#F3EDE3] border-[#D9CDBE] text-[#2D231F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#EDE4D5] border-[#D9CDBE] text-[#2D231F]">
                      <SelectItem value="lines">Đường kẻ</SelectItem>
                      <SelectItem value="dots">Điểm chấm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7A6A5C] text-xs">Kích thước ô:</label>
                  <Select
                    value={String(gridSize)}
                    onValueChange={(val) => onGridSizeChange?.(Number(val))}
                    disabled={!showGrid}
                  >
                    <SelectTrigger className="h-8 text-xs bg-[#F3EDE3] border-[#D9CDBE] text-[#2D231F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#EDE4D5] border-[#D9CDBE] text-[#2D231F]">
                      <SelectItem value="20">20px</SelectItem>
                      <SelectItem value="40">40px</SelectItem>
                      <SelectItem value="80">80px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
            <div className="h-5 w-px bg-[#D9CDBE] mx-0.5" />
          </>
        )}

        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 10))}
          className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
          title="Thu nhỏ"
        >
          <ZoomOut size={15} />
        </button>

        <div className="relative" ref={zoomMenuRef}>
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="text-[#2D231F] text-xs w-12 text-center font-mono py-1 rounded hover:bg-[#F3EDE3] transition-colors"
            title="Chọn tỷ lệ zoom"
          >
            {zoom}%
          </button>
          {showZoomMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#EDE4D5] border border-[#D9CDBE] rounded-lg shadow-xl py-1 min-w-20 z-50">
              {ZOOM_PRESETS.map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    onZoomChange(pct);
                    setShowZoomMenu(false);
                  }}
                  className={`w-full text-xs px-3 py-1.5 text-center transition-colors ${
                    zoom === pct
                      ? "text-[#2D231F] bg-[rgba(45, 35, 31,0.08)]"
                      : "text-[#7A6A5C] hover:bg-[#F3EDE3]"
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
          className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
          title="Phóng to"
        >
          <ZoomIn size={15} />
        </button>

        <div className="h-5 w-px bg-[#D9CDBE] mx-0.5" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Làm lại (Ctrl+Shift+Z)"
        >
          <Redo2 size={15} />
        </button>

        <div className="h-5 w-px bg-[#D9CDBE] mx-0.5" />

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#D9CDBE] text-[#2D231F] text-xs rounded hover:bg-[#D9CDBE] transition-colors"
          title="Lưu (Ctrl+S)"
        >
          <Save size={13} />
          <span className="hidden sm:inline">Lưu (Tự động lưu sau 5 giây)</span>
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2D231F] text-[#F3EDE3] text-xs font-bold rounded hover:opacity-90 transition-colors"
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
            className="bg-[#EDE4D5] border border-[#D9CDBE] rounded-2xl shadow-2xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#2D231F] text-base font-semibold mb-4 text-center">
              Bạn muốn xem bằng:
            </h3>
            <div className="flex flex-col gap-2">
              {PREVIEW_DEVICES.map((device) => {
                const Icon = device.icon;
                return (
                  <button
                    key={device.id}
                    onClick={() => handlePreviewDevice(device)}
                    className="flex items-center gap-3 px-4 py-3 bg-[#F3EDE3] hover:bg-[#F3EDE3] rounded-xl text-[#2D231F] text-sm transition-colors"
                  >
                    <Icon size={20} className="text-[#2D231F]" />
                    <span>{device.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="mt-3 w-full py-2 text-[#7A6A5C] hover:text-[#2D231F] text-xs transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
