import Switch from "@/templates/customer-design/ui/Switch";
import {
  Share2,
  Layers,
  Settings,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Music,
  Play,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Unlink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import type { EditorElement } from "./types";

interface Props {
  sharedToCommunity: boolean;
  onToggleShareToCommunity: () => void;
  elements: EditorElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElements: (updater: EditorElement[] | ((prev: EditorElement[]) => EditorElement[])) => void;
  onUngroupElements?: (groupId: string) => void;
}

type TabType = "layers" | "settings";

export default function RightPanel({
  sharedToCommunity,
  onToggleShareToCommunity,
  elements = [],
  selectedElementId,
  onSelectElement,
  onUpdateElements,
  onUngroupElements,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("layers");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => b.zIndex - a.zIndex);
  }, [elements]);

  type LayerItem =
    | { kind: "single"; el: EditorElement }
    | { kind: "group"; groupId: string; members: EditorElement[]; topZ: number };

  const layerItems = useMemo((): LayerItem[] => {
    const seenGroups = new Set<string>();
    const result: LayerItem[] = [];
    for (const el of sortedElements) {
      if (el.groupId) {
        if (!seenGroups.has(el.groupId)) {
          seenGroups.add(el.groupId);
          const members = sortedElements.filter((e) => e.groupId === el.groupId);
          result.push({ kind: "group", groupId: el.groupId, members, topZ: members[0].zIndex });
        }
      } else {
        result.push({ kind: "single", el });
      }
    }
    return result;
  }, [sortedElements]);

  const handleMove = (id: string, direction: "up" | "down") => {
    const sortedAsc = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const normalized = sortedAsc.map((el, idx) => ({ ...el, zIndex: idx }));

    const index = normalized.findIndex((el) => el.id === id);
    if (index === -1) return;

    if (direction === "up") {
      if (index < normalized.length - 1) {
        const temp = normalized[index].zIndex;
        normalized[index].zIndex = normalized[index + 1].zIndex;
        normalized[index + 1].zIndex = temp;
        onUpdateElements(normalized);
      }
    } else {
      if (index > 0) {
        const temp = normalized[index].zIndex;
        normalized[index].zIndex = normalized[index - 1].zIndex;
        normalized[index - 1].zIndex = temp;
        onUpdateElements(normalized);
      }
    }
  };

  const handleToggleVisibility = (id: string, currentVisible: boolean) => {
    onUpdateElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, visible: !currentVisible } : el))
    );
  };

  const handleToggleLock = (id: string, currentLocked: boolean) => {
    onUpdateElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, locked: !currentLocked } : el))
    );
  };

  const handleDelete = (id: string) => {
    onUpdateElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      onSelectElement(null);
    }
  };
  const getElementInfo = (el: EditorElement): { icon: React.ReactNode; label: string; typeLabel: string; src?: string } => {
    switch (el.type) {
      case "text":
        return {
          icon: <Type size={14} className="text-[#a78bfa]" />,
          label: el.content?.trim() ? el.content : "Văn bản trống",
          typeLabel: "Văn bản",
        };
      case "image":
        return {
          icon: <ImageIcon size={14} className="text-[#3b82f6]" />,
          label: "Hình ảnh",
          typeLabel: "Hình ảnh",
          src: el.src,
        };
      case "shape": {
        let label = "Hình vẽ";
        let icon = <Square size={14} className="text-[#10b981]" />;
        if (el.shapeType === "circle") {
          label = "Hình tròn";
          icon = <Circle size={14} className="text-[#10b981]" />;
        } else if (el.shapeType === "triangle") {
          label = "Hình tam giác";
          icon = <Triangle size={14} className="text-[#10b981]" />;
        } else if (el.shapeType === "line") {
          label = "Đường thẳng";
          icon = <Activity size={14} className="text-[#10b981]" />;
        } else if (el.shapeType === "rect" || el.shapeType === "square") {
          label = "Hình chữ nhật";
        } else {
          label = `Hình ${el.shapeType}`;
        }
        return { icon, label, typeLabel: "Hình vẽ" };
      }
      case "widget": {
        let label = "Tiện ích";
        let icon = <Layers size={14} className="text-[#f59e0b]" />;
        if (el.widgetType === "calendar") {
          label = "Lịch";
          icon = <Calendar size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "countdown") {
          label = "Đếm ngược";
          icon = <Clock size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "map") {
          label = "Bản đồ";
          icon = <MapPin size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "call") {
          label = "Gọi điện";
          icon = <Phone size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "rsvp") {
          label = "RSVP / Xác nhận";
          icon = <Mail size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "qr") {
          label = "Mã QR";
          icon = <QrCode size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "music") {
          label = "Âm nhạc";
          icon = <Music size={14} className="text-[#f59e0b]" />;
        } else if (el.widgetType === "youtube") {
          label = "Video Youtube";
          icon = <Play size={14} className="text-[#f59e0b]" />;
        }
        return { icon, label, typeLabel: "Tiện ích" };
      }
      default:
        return {
          icon: <Layers size={14} className="text-gray-400" />,
          label: "Đối tượng",
          typeLabel: "Đối tượng",
        };
    }
  };

  return (
    <aside className="w-80 bg-[#141215] border-l border-[#2a252c] flex flex-col overflow-y-auto shrink-0 select-none">
      <div className="flex border-b border-[#2a252c] shrink-0 bg-[#1c181e]">
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === "layers"
            ? "text-[#d4af37] border-[#d4af37] bg-[#141215]/50"
            : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#141215]/20"
            }`}
        >
          <Layers size={14} />
          Lớp bản vẽ ({layerItems.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === "settings"
            ? "text-[#d4af37] border-[#d4af37] bg-[#141215]/50"
            : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#141215]/20"
            }`}
        >
          <Settings size={14} />
          Cài đặt
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "layers" ? (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              <span>Danh sách đối tượng (Mới ở trên)</span>
            </div>

            {sortedElements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[#2a252c] rounded-xl bg-[#1c181e]/30">
                <Layers size={28} className="text-gray-600 mb-2" />
                <p className="text-gray-400 text-xs font-medium">Chưa có đối tượng nào</p>
                <p className="text-gray-600 text-[10px] mt-1 px-4">
                  Thêm văn bản, hình ảnh, hình vẽ hoặc các tiện ích từ thanh công cụ bên trái.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {layerItems.map((item, visualIndex) => {
                  if (item.kind === "group") {
                    const isExpanded = expandedGroups[item.groupId];
                    const isGroupSelected = item.members.some((m) => m.id === selectedElementId);
                    return (
                      <div key={item.groupId} className="space-y-1">
                        <div
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${isGroupSelected
                            ? "bg-[#251f28] border-[#d4af37]/60 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                            : "bg-[#1c181e] border-[#2a252c] hover:bg-[#251f28]/40 hover:border-[#3a333d]"
                            }`}
                          onClick={() => {
                            onSelectElement(item.members[0]?.id ?? null);
                          }}
                        >
                          <button
                            className="text-gray-500 hover:text-gray-200 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [item.groupId]: !prev[item.groupId],
                              }));
                            }}
                          >
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </button>

                          <div className="w-8 h-8 rounded bg-[#141215] border border-[#2a252c] flex items-center justify-center shrink-0">
                            <Layers size={14} className="text-[#d4af37]" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${isGroupSelected ? "text-white" : "text-gray-300"}`}>
                              Nhóm Preset
                            </p>
                            <p className="text-[9px] text-gray-500 font-medium tracking-wide mt-0.5">
                              {item.members.length} đối tượng
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUngroupElements?.(item.groupId);
                            }}
                            title="Bỏ nhóm"
                            className="p-1.5 rounded text-[#d4af37]/70 hover:text-[#d4af37] hover:bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          >
                            <Unlink size={13} />
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="ml-6 space-y-1 border-l border-[#2a252c] pl-3">
                            {item.members.map((el) => {
                              const info = getElementInfo(el);
                              const isSel = selectedElementId === el.id;
                              return (
                                <div
                                  key={el.id}
                                  onClick={() => onSelectElement(el.id)}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-[10px] transition-all ${isSel ? "bg-[#251f28] text-white" : "text-gray-400 hover:text-gray-200 hover:bg-[#251f28]/30"
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
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
                        ? "bg-[#251f28] border-[#d4af37]/60 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                        : "bg-[#1c181e] border-[#2a252c] hover:bg-[#251f28]/40 hover:border-[#3a333d]"
                        }`}
                    >
                      <span className="text-[10px] text-gray-600 font-mono w-4 text-center shrink-0">
                        {layerItems.length - visualIndex}
                      </span>

                      <div className="w-8 h-8 rounded bg-[#141215] border border-[#2a252c] flex items-center justify-center shrink-0 overflow-hidden relative">
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
                          className={`text-xs font-medium truncate ${isSelected ? "text-white" : "text-gray-300"
                            }`}
                        >
                          {info.label}
                        </p>
                        <p className="text-[9px] text-gray-500 font-medium tracking-wide mt-0.5">
                          {info.typeLabel}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(el.id, "up");
                          }}
                          disabled={visualIndex === 0}
                          title="Đưa lên trên"
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#342b39] disabled:opacity-20 disabled:hover:bg-transparent"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(el.id, "down");
                          }}
                          disabled={visualIndex === layerItems.length - 1}
                          title="Đưa xuống dưới"
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#342b39] disabled:opacity-20 disabled:hover:bg-transparent"
                        >
                          <ArrowDown size={13} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(el.id, el.visible !== false);
                          }}
                          title={el.visible !== false ? "Ẩn lớp" : "Hiện lớp"}
                          className={`p-1 rounded ${el.visible !== false
                            ? "text-gray-400 hover:text-white hover:bg-[#342b39]"
                            : "text-red-400 hover:text-red-300 hover:bg-[#3d2025]"
                            }`}
                        >
                          {el.visible !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLock(el.id, !!el.locked);
                          }}
                          title={el.locked ? "Mở khóa" : "Khóa vị trí"}
                          className={`p-1 rounded ${el.locked
                            ? "text-yellow-500 hover:text-yellow-400 hover:bg-[#3d3820]"
                            : "text-gray-400 hover:text-white hover:bg-[#342b39]"
                            }`}
                        >
                          {el.locked ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(el.id);
                          }}
                          title="Xóa đối tượng"
                          className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-[#3d2025]"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <Section label="Chia sẻ">
              <div className="bg-[#1c181e] rounded-lg p-4 space-y-3 border border-[#2a252c]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#d4af37]/20">
                    <Share2 size={16} className="text-[#d4af37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Chia sẻ cho cộng đồng</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      Cho phép cộng đồng xem và sử dụng thiệp của bạn làm mẫu tham khảo.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-400 text-xs">
                    {sharedToCommunity ? "Đã chia sẻ" : "Chưa chia sẻ"}
                  </span>
                  <Switch checked={sharedToCommunity} onChange={onToggleShareToCommunity} />
                </div>
              </div>
            </Section>
          </div>
        )}
      </div>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
