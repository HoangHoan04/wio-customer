import { clsx } from "clsx";
import {
  ChevronLeft,
  Cog,
  Grid,
  LayoutDashboard,
  Music,
  Presentation,
  Sparkles,
  Sticker,
  Toolbox,
  Type,
  UploadCloud,
  Wallpaper,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import PanelContent from "./panels/PanelContent";
import type { EditorElement, EditorTool, WidgetConfig, WidgetType } from "./types";

interface ToolItem {
  id: EditorTool;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const TOOLS: ToolItem[] = [
  { id: "template", label: "Mẫu", icon: LayoutDashboard },
  { id: "text", label: "Văn bản", icon: Type },
  { id: "uploads", label: "Tải lên", icon: UploadCloud },
  { id: "shape", label: "Hình dạng", icon: Grid },
  { id: "stock", label: "Kho sticker", icon: Sticker },
  { id: "background", label: "Nền", icon: Wallpaper },
  { id: "music", label: "Âm nhạc", icon: Music },
  { id: "utility", label: "Tiện ích", icon: Toolbox },
  { id: "preset", label: "Preset", icon: Presentation },
  { id: "effect", label: "Hiệu ứng", icon: Sparkles },
  { id: "property", label: "Công cụ", icon: Cog },
];

interface Props {
  selectedTool: EditorTool | null;
  onToolSelect: (tool: EditorTool | null) => void;
  selectedElement: EditorElement | null;
  canvasBackground: string;
  backgroundOpacity?: number;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onDeleteElement: (id: string) => void;
  onDeleteElements?: (ids: string[]) => void;
  onSetBackground: (color: string) => void;
  onSetBackgroundOpacity?: (opacity: number) => void;
  selectedAudio?: {
    id: string;
    name: string;
    url?: string;
    duration: string;
    source?: "admin" | "user";
  } | null;
  onSelectAudio?: (
    audio: {
      id: string;
      name: string;
      url?: string;
      duration: string;
      source?: "admin" | "user";
    } | null
  ) => void;
  onAddImageToCanvas: (
    url: string,
    settings?: {
      width?: number;
      height?: number;
      opacity?: number;
      borderRadius?: number;
      shadowBlur?: number;
      shadowColor?: string;
    }
  ) => void;
  selectedCanvasImageUrl?: string | null;
  onDeselectImage?: () => void;
  onAddText: () => void;
  onAddShape: (type: string) => void;
  elements: EditorElement[];
  onUpdateWidgetConfig: (
    widgetType: WidgetType,
    enabled: boolean,
    updates?: Partial<WidgetConfig>
  ) => void;
  onSelectElement?: (id: string | null) => void;
  onAlignElement?: (
    id: string,
    align: { h?: "left" | "center" | "right"; v?: "top" | "middle" | "bottom" }
  ) => void;
}

export default function LeftToolbar({
  selectedTool,
  onToolSelect,
  selectedElement,
  canvasBackground,
  backgroundOpacity = 1,
  onUpdateElement,
  onDeleteElement,
  onDeleteElements,
  onSetBackground,
  onSetBackgroundOpacity,
  onAddImageToCanvas,
  selectedCanvasImageUrl,
  onDeselectImage,
  onAddText,
  onAddShape,
  elements,
  onUpdateWidgetConfig,
  onSelectElement,
  onAlignElement,
  selectedAudio,
  onSelectAudio,
}: Props) {
  const [hoveredTool, setHoveredTool] = useState<EditorTool | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPinned = selectedTool !== null;
  const activePanel = isPinned ? selectedTool : hoveredTool;

  const handleMouseEnter = useCallback((tool: EditorTool) => {
    setHoveredTool(tool);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) {
      setHoveredTool(null);
    }
  }, [isPinned]);

  const handleClick = useCallback(
    (tool: EditorTool) => {
      if (selectedTool === tool) {
        onToolSelect(null);
        setHoveredTool(null);
      } else {
        onToolSelect(tool);
        setHoveredTool(tool);
      }
    },
    [selectedTool, onToolSelect]
  );

  const handleCollapse = useCallback(() => {
    onToolSelect(null);
    setHoveredTool(null);
  }, [onToolSelect]);

  return (
    <div
      ref={containerRef}
      className="flex h-full shrink-0 select-none"
      onMouseLeave={handleMouseLeave}
    >
      <aside className="w-18 bg-[#0e0f11] flex flex-col items-center py-2 h-full shrink-0 border-r border-[#252627]">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = selectedTool === tool.id;

          return (
            <button
              key={tool.id}
              onMouseEnter={() => handleMouseEnter(tool.id)}
              onClick={() => handleClick(tool.id)}
              className={clsx(
                "w-16 h-16 flex flex-col items-center justify-center rounded-lg transition-all duration-150 my-0.5 relative group",
                isActive
                  ? "bg-[#252627] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#252627]/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-0.75 bg-white rounded-r-full" />
              )}

              <div className="transition-transform duration-150 group-hover:scale-105">
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              </div>

              <span className="text-[10px] font-medium tracking-wide mt-1.5 text-center px-1 truncate w-full">
                {tool.label}
              </span>
            </button>
          );
        })}
      </aside>

      {activePanel && (
        <div
          ref={panelRef}
          className="w-75 bg-[#222] border-r border-[#333] flex flex-col overflow-hidden animate-panel-in"
          onMouseEnter={() => {
            if (isPinned) setHoveredTool(activePanel);
          }}
          onMouseLeave={() => {
            if (!isPinned) setHoveredTool(null);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#333] shrink-0">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">
              {TOOLS.find((t) => t.id === activePanel)?.label || activePanel}
            </h3>
            <button
              onClick={handleCollapse}
              className="p-1 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Thu gọn"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <PanelContent
              tool={activePanel as EditorTool}
              elements={elements}
              selectedElement={selectedElement}
              canvasBackground={canvasBackground}
              backgroundOpacity={backgroundOpacity}
              onUpdateElement={onUpdateElement}
              onUpdateWidgetConfig={onUpdateWidgetConfig}
              onDeleteElement={onDeleteElement}
              onDeleteElements={onDeleteElements}
              onSetBackground={onSetBackground}
              onSetBackgroundOpacity={onSetBackgroundOpacity}
              onAddImageToCanvas={onAddImageToCanvas}
              selectedCanvasImageUrl={selectedCanvasImageUrl}
              onDeselectImage={onDeselectImage}
              onAddText={onAddText}
              onAddShape={onAddShape}
              onSelect={onSelectElement}
              onAlignElement={onAlignElement}
              selectedAudio={selectedAudio}
              onSelectAudio={onSelectAudio}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes panel-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-panel-in {
          animation: panel-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
