import {
  Activity,
  ArrowDown,
  ArrowUp,
  Calendar,
  Circle,
  Clock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers,
  Lock,
  Mail,
  MapPin,
  Music,
  Phone,
  Play,
  QrCode,
  Square,
  Trash2,
  Triangle,
  Type,
  Unlink,
  Unlock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { EditorElement } from "../types";
import {
  buildLayerItems,
  layerItemIds,
  moveLayerItem,
  patchElements,
  removeElements,
  type LayerItem,
} from "../utils/layers";

interface LayersPanelContentProps {
  elements: EditorElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElements: (
    updater: EditorElement[] | ((prev: EditorElement[]) => EditorElement[]),
  ) => void;
  onUngroupElements?: (groupId: string) => void;
  compact?: boolean;
}

function getElementInfo(el: EditorElement): {
  icon: React.ReactNode;
  label: string;
  typeLabel: string;
  src?: string;
} {
  switch (el.type) {
    case "text":
      return {
        icon: <Type size={14} className="text-[#2D231F]" />,
        label: el.content?.trim() ? el.content : "Văn bản trống",
        typeLabel: "Văn bản",
      };
    case "image":
      return {
        icon: <ImageIcon size={14} className="text-[#2D231F]" />,
        label: "Hình ảnh",
        typeLabel: "Hình ảnh",
        src: el.src,
      };
    case "shape": {
      let label = "Hình vẽ";
      let icon = <Square size={14} className="text-[#2D231F]" />;
      if (el.shapeType === "circle") {
        label = "Hình tròn";
        icon = <Circle size={14} className="text-[#2D231F]" />;
      } else if (el.shapeType === "triangle") {
        label = "Hình tam giác";
        icon = <Triangle size={14} className="text-[#2D231F]" />;
      } else if (el.shapeType === "line") {
        label = "Đường thẳng";
        icon = <Activity size={14} className="text-[#2D231F]" />;
      } else if (el.shapeType === "rect" || el.shapeType === "square") {
        label = "Hình chữ nhật";
      } else {
        label = `Hình ${el.shapeType}`;
      }
      return { icon, label, typeLabel: "Hình vẽ" };
    }
    case "widget": {
      const widgets: Record<string, { label: string; icon: React.ReactNode }> = {
        calendar: { label: "Lịch", icon: <Calendar size={14} className="text-[#2D231F]" /> },
        countdown: { label: "Đếm ngược", icon: <Clock size={14} className="text-[#2D231F]" /> },
        map: { label: "Bản đồ", icon: <MapPin size={14} className="text-[#2D231F]" /> },
        call: { label: "Gọi điện", icon: <Phone size={14} className="text-[#2D231F]" /> },
        rsvp: { label: "RSVP / Xác nhận", icon: <Mail size={14} className="text-[#2D231F]" /> },
        qr: { label: "Mã QR", icon: <QrCode size={14} className="text-[#2D231F]" /> },
        music: { label: "Âm nhạc", icon: <Music size={14} className="text-[#2D231F]" /> },
        youtube: { label: "Video YouTube", icon: <Play size={14} className="text-[#2D231F]" /> },
        gallery: { label: "Thư viện ảnh", icon: <Layers size={14} className="text-[#2D231F]" /> },
        album: { label: "Album ghép", icon: <Layers size={14} className="text-[#2D231F]" /> },
        carousel: { label: "Carousel 3D", icon: <Layers size={14} className="text-[#2D231F]" /> },
      };
      const meta = el.widgetType ? widgets[el.widgetType] : undefined;
      return {
        icon: meta?.icon ?? <Layers size={14} className="text-[#2D231F]" />,
        label: meta?.label ?? "Tiện ích",
        typeLabel: "Tiện ích",
      };
    }
    default:
      return {
        icon: <Layers size={14} className="text-[#7A6A5C]" />,
        label: "Đối tượng",
        typeLabel: "Đối tượng",
      };
  }
}

function LayerActions({
  item,
  isFirst,
  isLast,
  onMove,
  onToggleVisible,
  onToggleLock,
  onDelete,
  onUngroup,
}: {
  item: LayerItem;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: "up" | "down") => void;
  onToggleVisible: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onUngroup?: () => void;
}) {
  const els = item.kind === "single" ? [item.el] : item.members;
  const visible = els.every((el) => el.visible !== false);
  const locked = els.some((el) => el.locked);

  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMove("up");
        }}
        disabled={isFirst}
        title="Đưa lên trên"
        className="p-1 rounded text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] disabled:opacity-20 disabled:hover:bg-transparent"
      >
        <ArrowUp size={13} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMove("down");
        }}
        disabled={isLast}
        title="Đưa xuống dưới"
        className="p-1 rounded text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3] disabled:opacity-20 disabled:hover:bg-transparent"
      >
        <ArrowDown size={13} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisible();
        }}
        title={visible ? "Ẩn lớp" : "Hiện lớp"}
        className={`p-1 rounded ${
          visible
            ? "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
            : "text-red-400 hover:text-red-300 hover:bg-[#F3EDE3]"
        }`}
      >
        {visible ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLock();
        }}
        title={locked ? "Mở khóa" : "Khóa vị trí"}
        className={`p-1 rounded ${
          locked
            ? "text-yellow-600 hover:text-yellow-500 hover:bg-[#F3EDE3]"
            : "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
        }`}
      >
        {locked ? <Lock size={13} /> : <Unlock size={13} />}
      </button>
      {onUngroup && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUngroup();
          }}
          title="Bỏ nhóm"
          className="p-1 rounded text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#F3EDE3]"
        >
          <Unlink size={13} />
        </button>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Xóa"
        className="p-1 rounded text-[#7A6A5C] hover:text-red-500 hover:bg-[#F3EDE3]"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export default function LayersPanelContent({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElements,
  onUngroupElements,
}: LayersPanelContentProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const layerItems = useMemo(() => buildLayerItems(elements), [elements]);

  const applyItemPatch = (item: LayerItem, patch: Partial<EditorElement>) => {
    const ids = layerItemIds(item);
    onUpdateElements((prev) => patchElements(prev, ids, patch));
  };

  const handleDelete = (item: LayerItem) => {
    const ids = layerItemIds(item);
    onUpdateElements((prev) => removeElements(prev, ids));
    if (selectedElementId && ids.includes(selectedElementId)) {
      onSelectElement(null);
    }
  };

  if (elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[#D9CDBE] rounded-xl bg-[#EDE4D5]/30">
        <Layers size={28} className="text-[#7A6A5C]/60 mb-2" />
        <p className="text-[#7A6A5C] text-xs font-medium">Chưa có đối tượng nào</p>
        <p className="text-[#7A6A5C]/60 text-[10px] mt-1 px-4">
          Thêm văn bản, hình ảnh, hình vẽ hoặc tiện ích từ thanh công cụ bên trái.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-bold text-[#7A6A5C]/70 uppercase tracking-wider">
        <span>Danh sách đối tượng ({layerItems.length})</span>
        <span>Mới ở trên</span>
      </div>

      <div className="space-y-2">
        {layerItems.map((item, visualIndex) => {
          const isFirst = visualIndex === 0;
          const isLast = visualIndex === layerItems.length - 1;
          const move = (direction: "up" | "down") =>
            onUpdateElements((prev) => moveLayerItem(prev, item.id, direction));

          if (item.kind === "group") {
            const isExpanded = expandedGroups[item.groupId];
            const isGroupSelected = item.members.some(
              (m) => m.id === selectedElementId,
            );
            const hidden = item.members.every((m) => m.visible === false);
            return (
              <div key={item.groupId} className="space-y-1">
                <div
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isGroupSelected
                      ? "bg-[#EDE4D5] border-[#2D231F]/60 shadow-[0_0_12px_rgba(45,35,31,0.08)]"
                      : "bg-[#EDE4D5] border-[#D9CDBE] hover:border-[#2D231F]/40"
                  } ${hidden ? "opacity-50" : ""}`}
                  onClick={() => onSelectElement(item.members[0]?.id ?? null)}
                >
                  <button
                    type="button"
                    className="text-[#7A6A5C]/70 hover:text-[#2D231F] shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedGroups((prev) => ({
                        ...prev,
                        [item.groupId]: !prev[item.groupId],
                      }));
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                  </button>
                  <div className="w-8 h-8 rounded bg-[#F3EDE3] border border-[#D9CDBE] flex items-center justify-center shrink-0">
                    <Layers size={14} className="text-[#2D231F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        isGroupSelected ? "text-[#2D231F]" : "text-[#7A6A5C]"
                      }`}
                    >
                      Nhóm
                    </p>
                    <p className="text-[9px] text-[#7A6A5C]/70 font-medium tracking-wide mt-0.5">
                      {item.members.length} đối tượng
                    </p>
                  </div>
                  <LayerActions
                    item={item}
                    isFirst={isFirst}
                    isLast={isLast}
                    onMove={move}
                    onToggleVisible={() =>
                      applyItemPatch(item, { visible: hidden })
                    }
                    onToggleLock={() =>
                      applyItemPatch(item, {
                        locked: !item.members.some((m) => m.locked),
                      })
                    }
                    onDelete={() => handleDelete(item)}
                    onUngroup={
                      onUngroupElements
                        ? () => onUngroupElements(item.groupId)
                        : undefined
                    }
                  />
                </div>

                {isExpanded && (
                  <div className="ml-6 space-y-1 border-l border-[#D9CDBE] pl-3">
                    {item.members.map((el) => {
                      const info = getElementInfo(el);
                      const isSel = selectedElementId === el.id;
                      return (
                        <div
                          key={el.id}
                          onClick={() => onSelectElement(el.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-[10px] transition-all ${
                            isSel
                              ? "bg-[#EDE4D5] text-[#2D231F]"
                              : "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#EDE4D5]/30"
                          }`}
                        >
                          <span className="shrink-0">{info.icon}</span>
                          <span className="truncate">{info.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const { el } = item;
          const isSelected = selectedElementId === el.id;
          const info = getElementInfo(el);
          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-[#EDE4D5] border-[#2D231F]/60 shadow-[0_0_12px_rgba(45,35,31,0.08)]"
                  : "bg-[#EDE4D5] border-[#D9CDBE] hover:border-[#2D231F]/40"
              } ${el.visible === false ? "opacity-50" : ""}`}
            >
              <span className="text-[10px] text-[#7A6A5C]/60 font-mono w-4 text-center shrink-0">
                {layerItems.length - visualIndex}
              </span>
              <div className="w-8 h-8 rounded bg-[#F3EDE3] border border-[#D9CDBE] flex items-center justify-center shrink-0 overflow-hidden relative">
                {info.src ? (
                  <img
                    src={info.src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  info.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium truncate ${
                    isSelected ? "text-[#2D231F]" : "text-[#7A6A5C]"
                  }`}
                >
                  {info.label}
                </p>
                <p className="text-[9px] text-[#7A6A5C]/70 font-medium tracking-wide mt-0.5">
                  {info.typeLabel}
                </p>
              </div>
              <LayerActions
                item={item}
                isFirst={isFirst}
                isLast={isLast}
                onMove={move}
                onToggleVisible={() =>
                  applyItemPatch(item, { visible: el.visible === false })
                }
                onToggleLock={() => applyItemPatch(item, { locked: !el.locked })}
                onDelete={() => handleDelete(item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
