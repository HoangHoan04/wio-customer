import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
  ChevronUp,
  Copy,
  Maximize2,
  Trash2,
  ZoomIn,
} from "lucide-react";
import type { EditorElement } from "./types";

interface Props {
  selectedElement: EditorElement | null;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onZoomToFit: () => void;
  onZoom100: () => void;
  zoom: number;
}

export default function BottomToolbar({
  selectedElement,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onDuplicate,
  onDelete,
  onZoomToFit,
  onZoom100,
  zoom,
}: Props) {
  const hasSelection = selectedElement !== null;

  return (
    <div className="h-12 bg-[#EDE4D5] border-b border-[#D9CDBE] flex items-center justify-between px-4 shrink-0 overflow-x-auto select-none">
      <div className="flex items-center gap-1">
        <button
          onClick={onZoomToFit}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded text-xs transition-colors"
          title="Zoom vừa khung"
        >
          <Maximize2 size={14} />
          <span className="hidden sm:inline">Fit</span>
        </button>
        <button
          onClick={onZoom100}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded text-xs transition-colors"
          title="Zoom 100%"
        >
          <ZoomIn size={14} />
          <span className="hidden sm:inline">{zoom}%</span>
        </button>
      </div>

      {hasSelection && (
        <div className="flex items-center gap-1" key={selectedElement.id}>
          <div className="h-5 w-px bg-[#D9CDBE] mx-1" />

          <button
            onClick={onBringToFront}
            className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
            title="Lên trên cùng"
          >
            <ArrowUpFromLine size={14} />
          </button>
          <button
            onClick={onBringForward}
            className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
            title="Lên trên"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={onSendBackward}
            className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
            title="Xuống dưới"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={onSendToBack}
            className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
            title="Xuống dưới cùng"
          >
            <ArrowDownToLine size={14} />
          </button>

          <div className="h-5 w-px bg-[#D9CDBE] mx-1" />

          <button
            onClick={onDuplicate}
            className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
            title="Nhân bản"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] rounded transition-colors"
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>

          <div className="h-5 w-px bg-[#D9CDBE] mx-1" />

          <span className="text-[11px] text-[#7A6A5C]/60 font-mono ml-1 whitespace-nowrap">
            {selectedElement.type} · Z:{selectedElement.zIndex}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#7A6A5C]/60 font-mono">
          {hasSelection ? `${Math.round(selectedElement.x)}, ${Math.round(selectedElement.y)}` : ""}
        </span>
        <div className="h-5 w-px bg-[#D9CDBE]" />
        <span className="text-[11px] text-[#7A6A5C]/60 font-mono">Zoom: {zoom}%</span>
      </div>
    </div>
  );
}
