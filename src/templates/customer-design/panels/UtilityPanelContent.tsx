
import Button from "@/templates/customer-design/ui/button/Button";
import InputDate from "@/templates/customer-design/ui/input/InputDate";
import InputDateTime from "@/templates/customer-design/ui/input/InputDateTime";
import InputSwitch from "@/templates/customer-design/ui/input/InputSwitch";
import InputText from "@/templates/customer-design/ui/input/InputText";
import Select, {
  type SelectOption,
} from "@/templates/customer-design/ui/Select";
import { weddingService } from "@/services/wedding.service";
import { Loader2, Plus, Trash2, Check, CalendarIcon, MapIcon, PhoneIcon } from "lucide-react";
import { useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import Section from "../components/Section";
import type { EditorElement, WidgetConfig, WidgetType } from "../types";
import { CountdownIcon, GiftQrIcon, MessengerIcon, RSVPIcon, StackPhotoIcon, ViberIcon, VideoYoutubeIcon, ZaloIcon } from "@/assets/icons";
import FileUpload from "@/components/common/FileUpload";

const BANK_OPTIONS: SelectOption[] = [
  { label: "Vietcombank", value: "Vietcombank" },
  { label: "BIDV", value: "BIDV" },
  { label: "VietinBank", value: "VietinBank" },
  { label: "Agribank", value: "Agribank" },
  { label: "MB Bank", value: "MB Bank" },
  { label: "Techcombank", value: "Techcombank" },
  { label: "ACB", value: "ACB" },
  { label: "VPBank", value: "VPBank" },
  { label: "TPBank", value: "TPBank" },
  { label: "Sacombank", value: "Sacombank" },
  { label: "VIB", value: "VIB" },
  { label: "SHB", value: "SHB" },
  { label: "HDBank", value: "HDBank" },
  { label: "Ngân hàng khác", value: "OTHER" },
];

interface UtilityPanelContentProps {
  elements: EditorElement[];
  onUpdateWidgetConfig: (
    widgetType: WidgetType,
    enabled: boolean,
    updates?: Partial<WidgetConfig>,
  ) => void;
}

const extractAddressFromMapUrl = (url: string): string => {
  if (!url) return "";
  try {
    let targetUrl = url.trim();
    if (targetUrl.includes("<iframe")) {
      const match = targetUrl.match(/src=["']([^"']+)["']/);
      if (match) targetUrl = match[1];
    }
    if (targetUrl.startsWith("//")) targetUrl = "https:" + targetUrl;
    const urlObj = new URL(targetUrl);
    const q = urlObj.searchParams.get("q");
    if (q) return decodeURIComponent(q).replace(/\+/g, " ");
    const placeMatch = urlObj.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch)
      return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
  } catch {
    //! ignore parse error
  }
  return "";
};

export default function UtilityPanelContent({
  elements,
  onUpdateWidgetConfig,
}: UtilityPanelContentProps) {
  const [resolving, setResolving] = useState(false);

  const getWidgetState = (widgetType: WidgetType) => {
    const found = elements.find(
      (el) => el.type === "widget" && el.widgetType === widgetType,
    );
    return {
      isEnabled: !!found,
      config: found?.widgetConfig || {},
    };
  };

  const fontOptions: SelectOption[] = [
    { label: "Quicksand", value: "Quicksand" },
    { label: "Playfair Display", value: "Playfair Display" },
    { label: "Dancing Script", value: "Dancing Script" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Alex Brush", value: "Alex Brush" },
  ];

  const calendar = getWidgetState("calendar");
  const countdown = getWidgetState("countdown");
  const map = getWidgetState("map");
  const call = getWidgetState("call");
  const rsvp = getWidgetState("rsvp");
  const qr = getWidgetState("qr");
  const gallery = getWidgetState("gallery");
  const youtube = getWidgetState("youtube");

  const renderWidgetHeader = (
    label: string,
    icon: React.ReactNode,
    isEnabled: boolean,
    onToggle: () => void,
  ) => {
    return (
      <div
        className={`flex items-center justify-between py-2.5 px-3 bg-[#1e1e22] border-b border-zinc-800 transition-colors ${isEnabled ? "rounded-t-lg" : "rounded-lg border-b-transparent"}`}
      >
        <div className="flex items-center gap-2.5 select-none">
          <div
            className={`transition-colors ${isEnabled ? "text-[#d4af37]" : "text-zinc-500"}`}
          >
            {icon}
          </div>
          <span
            className={`font-medium text-[11px] ${isEnabled ? "text-gray-100" : "text-zinc-400"}`}
          >
            {label}
          </span>
          {isEnabled && (
            <div className="flex items-center gap-1.5 ml-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <Check size={10} strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <InputSwitch
            switchSize="sm"
            checked={isEnabled}
            onCheckedChange={onToggle}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      onKeyDown={(e) => e.stopPropagation()}
      className="space-y-4 text-gray-300 text-xs pb-40 select-none max-w-md mx-auto relative z-0"
    >
      <Section label={""}>
        <div className="space-y-3.5">
          <div
            className={`rounded-lg border border-zinc-800/60 bg-[#16161a] transition-all ${calendar.isEnabled ? "relative z-30" : ""}`}
          >
            {renderWidgetHeader(
              "Lịch đám cưới",
              <CalendarIcon width={16} height={16} />,
              calendar.isEnabled,
              () => {
                const nextEnabled = !calendar.isEnabled;
                onUpdateWidgetConfig("calendar", nextEnabled, {
                  calendarEnabled: nextEnabled,
                  targetDate:
                    calendar.config.targetDate ||
                    new Date().toISOString().split("T")[0],
                });
              },
            )}

            {calendar.isEnabled && (
              <div className="p-3 space-y-3.5 bg-[#121214] rounded-b-lg animate-fadeIn relative">
                <InputDate
                  label="Ngày nổi bật (Highlighted):"
                  value={
                    calendar.config.targetDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(val) =>
                    onUpdateWidgetConfig("calendar", true, { targetDate: val })
                  }
                />

                <div className="relative z-20">
                  <Select
                    label="Kiểu hiển thị đầu mục:"
                    size="sm"
                    value={calendar.config.calendarDisplayMode || "full"}
                    options={[
                      { label: "Hiển thị đầy đủ (Tháng / Năm)", value: "full" },
                      { label: "Tối giản (Chỉ ngày)", value: "date-only" },
                    ]}
                    onValueChange={(val) =>
                      onUpdateWidgetConfig("calendar", true, {
                        calendarDisplayMode: val as any,
                      })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Giao diện hiển thị lịch
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        value: "classic",
                        label: "Cổ điển",
                        desc: "Khung viền truyền thống",
                      },
                      {
                        value: "modern",
                        label: "Hiện đại",
                        desc: "Góc bo mượt mà",
                      },
                      {
                        value: "romantic",
                        label: "Lãng mạn",
                        desc: "Tone màu mềm mại",
                      },
                      {
                        value: "minimal",
                        label: "Tối giản",
                        desc: "Focus vào ngày cưới",
                      },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          onUpdateWidgetConfig("calendar", true, {
                            calendarStyle: item.value as any,
                          })
                        }
                        className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                          (calendar.config.calendarStyle || "classic") ===
                          item.value
                            ? "bg-[#d4af37]/10 border-[#d4af37] text-white"
                            : "bg-[#1c1c1e] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-bold ${(calendar.config.calendarStyle || "classic") === item.value ? "text-[#d4af37]" : "text-zinc-200"}`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[9px] opacity-60 mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                      Màu sắc chủ đạo
                    </label>
                    <ColorPickerRow
                      value={calendar.config.color || "#d4af37"}
                      onChange={(val) =>
                        onUpdateWidgetConfig("calendar", true, { color: val })
                      }
                    />
                  </div>
                  <div className="relative z-10">
                    <Select
                      label="Font chữ:"
                      size="sm"
                      value={calendar.config.fontFamily || "Quicksand"}
                      options={fontOptions}
                      onValueChange={(val) =>
                        onUpdateWidgetConfig("calendar", true, {
                          fontFamily: val as string,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border border-zinc-800/60 bg-[#16161a] transition-all ${countdown.isEnabled ? "relative z-25" : ""}`}
          >
            {renderWidgetHeader(
              "Đếm ngược sự kiện",
              <CountdownIcon width={16} height={16} />,
              countdown.isEnabled,
              () =>
                onUpdateWidgetConfig("countdown", !countdown.isEnabled, {
                  countdownEnabled: !countdown.isEnabled,
                }),
            )}

            {countdown.isEnabled && (
              <div className="p-3 space-y-3 bg-[#121214] rounded-b-lg animate-fadeIn">
                <InputDateTime
                  label="Thời gian chính xác đám cưới:"
                  value={countdown.config.countdownTarget || ""}
                  onChange={(val) =>
                    onUpdateWidgetConfig("countdown", true, {
                      countdownTarget: val,
                    })
                  }
                />

                <div className="grid grid-cols-1 gap-2">
                  <div className="relative">
                    <Select
                      label="Đơn vị hiển thị:"
                      size="sm"
                      value={
                        countdown.config.countdownType || "days-hours-min-sec"
                      }
                      options={[
                        {
                          label: "Ngày - Giờ - Phút - Giây",
                          value: "days-hours-min-sec",
                        },
                        { label: "Giờ - Phút - Giây", value: "hours-min-sec" },
                      ]}
                      onValueChange={(val) =>
                        onUpdateWidgetConfig("countdown", true, {
                          countdownType: val as any,
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <Select
                      label="Bố cục khối:"
                      size="sm"
                      value={
                        countdown.config.countdownOrientation || "horizontal"
                      }
                      options={[
                        { label: "Hàng ngang (Mặc định)", value: "horizontal" },
                        { label: "Hàng dọc", value: "vertical" },
                      ]}
                      onValueChange={(val) =>
                        onUpdateWidgetConfig("countdown", true, {
                          countdownOrientation: val as any,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="relative">
                  <Select
                    label="Style thiết kế:"
                    size="sm"
                    value={countdown.config.countdownStyle || "classic"}
                    options={[
                      { label: "Cổ điển (Classic Burgundy)", value: "classic" },
                      {
                        label: "Kính mờ (Modern Glassmorphism)",
                        value: "modern",
                      },
                      {
                        label: "Giấy thô lãng mạn (Romantic Kraft)",
                        value: "romantic",
                      },
                      {
                        label: "Hoàng gia sang trọng (Luxury Navy)",
                        value: "luxury-navy",
                      },
                    ]}
                    onValueChange={(val) =>
                      onUpdateWidgetConfig("countdown", true, {
                        countdownStyle: val as any,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                      Màu chữ số
                    </label>
                    <ColorPickerRow
                      value={countdown.config.color || "#ffffff"}
                      onChange={(val) =>
                        onUpdateWidgetConfig("countdown", true, { color: val })
                      }
                    />
                  </div>
                  <div>
                    <Select
                      label="Font chữ số:"
                      size="sm"
                      value={countdown.config.fontFamily || "Quicksand"}
                      options={fontOptions}
                      onValueChange={(val) =>
                        onUpdateWidgetConfig("countdown", true, {
                          fontFamily: val as string,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border border-zinc-800/60 bg-[#16161a] transition-all ${map.isEnabled ? "relative z-20" : ""}`}
          >
            {renderWidgetHeader(
              "Bản đồ dẫn đường",
              <MapIcon width={16} height={16} />,
              map.isEnabled,
              () =>
                onUpdateWidgetConfig("map", !map.isEnabled, {
                  mapEnabled: !map.isEnabled,
                }),
            )}

            {map.isEnabled && (
              <div className="p-3 space-y-3 bg-[#121214] rounded-b-lg animate-fadeIn">
                <InputText
                  type="text"
                  label="Tên / Địa chỉ trung tâm tiệc cưới:"
                  placeholder="Ví dụ: Trung tâm hội nghị Gem Center..."
                  value={map.config.locationAddress || ""}
                  onChange={(e) =>
                    onUpdateWidgetConfig("map", true, {
                      locationAddress: e.target.value,
                    })
                  }
                />

                <div className="space-y-1">
                  <label className="block text-zinc-400 text-[11px] font-medium mb-1">
                    Nhúng Link Google Maps:
                  </label>
                  <div className="flex flex-col gap-2">
                    <InputText
                      type="text"
                      placeholder="Dán mã nhúng iframe hoặc link map..."
                      value={map.config.mapEmbedUrl || ""}
                      onChange={(e) =>
                        onUpdateWidgetConfig("map", true, {
                          mapEmbedUrl: e.target.value,
                        })
                      }
                      className="flex-1 bg-[#1c1c1e] border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-gray-200 placeholder-zinc-600 outline-none focus:border-[#d4af37]/50 transition-colors"
                    />
                    <button
                      type="button"
                      disabled={resolving || !map.config.mapEmbedUrl?.trim()}
                      onClick={async () => {
                        const inputUrl = map.config.mapEmbedUrl?.trim();
                        if (!inputUrl) return;
                        setResolving(true);
                        try {
                          const res =
                            await weddingService.resolveMapUrl(inputUrl);
                          const resolvedUrl = res?.data?.url || inputUrl;
                          const address =
                            extractAddressFromMapUrl(resolvedUrl) ||
                            map.config.locationAddress ||
                            "";
                          onUpdateWidgetConfig("map", true, {
                            mapEmbedUrl: resolvedUrl,
                            locationAddress:
                              address || map.config.locationAddress,
                          });
                        } catch {
                          //! error fallback
                        }
                        setResolving(false);
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b08d20] disabled:opacity-40 disabled:hover:bg-[#d4af37] transition-colors"
                    >
                      {resolving ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : null}
                      <span>Tải dữ liệu</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Select
                    label="Chế độ hiển thị bản đồ:"
                    size="sm"
                    value={map.config.mapType || "normal"}
                    options={[
                      { label: "Bản đồ đường bộ (Mặc định)", value: "normal" },
                      { label: "Vệ tinh thực tế", value: "satellite" },
                      { label: "Bản đồ địa hình", value: "terrain" },
                      { label: "Chế độ kết hợp", value: "hybrid" },
                    ]}
                    onValueChange={(val) =>
                      onUpdateWidgetConfig("map", true, { mapType: val as any })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3.5">
          <div
            className={`rounded-xl border border-zinc-800/80 bg-[#16161a] shadow-lg transition-all duration-300 ${call.isEnabled ? "relative z-30 ring-1 ring-zinc-800" : ""}`}
          >
            {renderWidgetHeader(
              "Thông tin liên hệ",
              <PhoneIcon
                width={16}
                height={16}
                className={call.isEnabled ? "text-[#d4af37]" : "text-zinc-400"}
              />,
              call.isEnabled,
              () =>
                onUpdateWidgetConfig("call", !call.isEnabled, {
                  contactEnabled: !call.isEnabled,
                }),
            )}

            {call.isEnabled && (
              <div className="p-4 space-y-4 bg-[#111112] border-t border-zinc-900 rounded-b-xl animate-fadeIn">
                <div className="flex gap-1.5 bg-[#18181b] rounded-lg p-1 border border-zinc-800/60">
                  {[
                    {
                      key: "phone",
                      icon: <PhoneIcon width={20} height={20} />,
                    },
                    {
                      key: "messenger",
                      icon: <MessengerIcon width={20} height={20} />,
                    },
                    {
                      key: "zalo",
                      icon: <ZaloIcon width={20} height={20} />,
                    },
                  ].map((tab) => {
                    const isActive =
                      (call.config.contactActiveTab || "phone") === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() =>
                          onUpdateWidgetConfig("call", true, {
                            contactActiveTab: tab.key as any,
                          })
                        }
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                          isActive
                            ? "bg-[#d4af37] text-black shadow-sm font-bold"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                        }`}
                      >
                        {tab.icon}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-[#141416] p-3.5 rounded-xl border border-zinc-800/50 space-y-4 shadow-inner">
                  {(call.config.contactActiveTab || "phone") === "phone" && (
                    <div className="space-y-3.5">
                      <InputSwitch
                        label="Kích hoạt nút gọi"
                        switchSize="sm"
                        checked={!!call.config.phoneEnabled}
                        onCheckedChange={(checked) =>
                          onUpdateWidgetConfig("call", true, {
                            phoneEnabled: checked,
                          })
                        }
                      />
                      {call.config.phoneEnabled && (
                        <div className="space-y-3 animate-slideDown">
                          <InputText
                            type="text"
                            label="Nhãn hiển thị"
                            value={call.config.phoneLabel || "Gọi điện"}
                            onChange={(e) =>
                              onUpdateWidgetConfig("call", true, {
                                phoneLabel: e.target.value,
                              })
                            }
                          />
                          <InputText
                            type="tel"
                            label="Số hotline chính"
                            placeholder="Nhập số điện thoại..."
                            value={call.config.phoneNumber || ""}
                            onChange={(e) =>
                              onUpdateWidgetConfig("call", true, {
                                phoneNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {(call.config.contactActiveTab || "phone") ===
                    "messenger" && (
                    <div className="space-y-3.5">
                      <InputSwitch
                        label="Kích hoạt messenger"
                        switchSize="sm"
                        checked={!!call.config.messengerEnabled}
                        onCheckedChange={(checked) =>
                          onUpdateWidgetConfig("call", true, {
                            messengerEnabled: checked,
                          })
                        }
                      />
                      {call.config.messengerEnabled && (
                        <div className="space-y-3 animate-slideDown">
                          <InputText
                            type="text"
                            label="Nhãn hiển thị"
                            value={call.config.messengerLabel || "Messenger"}
                            onChange={(e) =>
                              onUpdateWidgetConfig("call", true, {
                                messengerLabel: e.target.value,
                              })
                            }
                          />
                          <InputText
                            type="url"
                            label="Đường dẫn trang cá nhân (URL)"
                            placeholder="https://facebook.com/username"
                            value={call.config.messengerUrl || ""}
                            onChange={(e) =>
                              onUpdateWidgetConfig("call", true, {
                                messengerUrl: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {(call.config.contactActiveTab || "phone") === "zalo" && (
                    <div className="space-y-3.5">
                      <InputSwitch
                        label="Kích hoạt Chat Zalo"
                        switchSize="sm"
                        checked={!!call.config.zaloEnabled}
                        onCheckedChange={(checked) =>
                          onUpdateWidgetConfig("call", true, {
                            zaloEnabled: checked,
                          })
                        }
                      />
                      {call.config.zaloEnabled && (
                        <div className="space-y-3 animate-slideDown">
                          <InputText
                            type="text"
                            label="Nhãn hiển thị"
                            value={call.config.zaloLabel || "Zalo"}
                            onChange={(e) =>
                              onUpdateWidgetConfig("call", true, {
                                zaloLabel: e.target.value,
                              })
                            }
                          />
                          <InputText
                            type="tel"
                            label="Số điện thoại Zalo"
                            placeholder="090xxxxxxx"
                            value={call.config.zaloPhone || ""}
                            onChange={(e) =>
                              onUpdateWidgetConfig("call", true, {
                                zaloPhone: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border border-zinc-800/60 bg-[#16161a] transition-all ${rsvp.isEnabled ? "relative z-25" : ""}`}
          >
            {renderWidgetHeader(
              "Xác nhận tham dự (RSVP)",
              <RSVPIcon width={16} height={16} />,
              rsvp.isEnabled,
              () =>
                onUpdateWidgetConfig("rsvp", !rsvp.isEnabled, {
                  rsvpEnabled: !rsvp.isEnabled,
                }),
            )}

            {rsvp.isEnabled && (
              <div className="p-3 space-y-3 bg-[#121214] rounded-b-lg animate-fadeIn">
                <div className="relative z-10">
                  <Select
                    label="Cơ chế mở Form:"
                    size="sm"
                    value={rsvp.config.rsvpType || "full-form"}
                    options={[
                      { label: "Nút bấm bật Popup Modal", value: "button" },
                      {
                        label: "Hiển thị Form trực tiếp trên trang",
                        value: "full-form",
                      },
                    ]}
                    onValueChange={(val) =>
                      onUpdateWidgetConfig("rsvp", true, {
                        rsvpType: val as any,
                      })
                    }
                  />
                </div>

                <InputText
                  type="email"
                  label="Email nhận thông báo danh sách khách mời:"
                  placeholder="nhanrsvp@wedding.com"
                  value={rsvp.config.rsvpTargetEmail || ""}
                  onChange={(e) =>
                    onUpdateWidgetConfig("rsvp", true, {
                      rsvpTargetEmail: e.target.value,
                    })
                  }
                />

                <div className="py-1">
                  <InputSwitch
                    label="Gửi email phản hồi tự động cho khách"
                    switchSize="sm"
                    checked={!!rsvp.config.rsvpAutoConfirmEmail}
                    onCheckedChange={(checked) =>
                      onUpdateWidgetConfig("rsvp", true, {
                        rsvpAutoConfirmEmail: checked,
                      })
                    }
                  />
                </div>

                <Button
                  variant="gold"
                  buttonSize="sm"
                  className="w-full font-bold text-center justify-center bg-[#d4af37] text-black hover:bg-[#b08d20] shadow-md py-2"
                  onClick={() =>
                    alert("Xuất danh sách khách mời thành công file CSV.")
                  }
                >
                  Quản lý & Xuất file báo cáo (.CSV)
                </Button>
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border border-zinc-800/60 bg-[#16161a] transition-all ${qr.isEnabled ? "relative z-20" : ""}`}
          >
            {renderWidgetHeader(
              "Mừng cưới qua VietQR",
              <GiftQrIcon width={16} height={16} />,
              qr.isEnabled,
              () =>
                onUpdateWidgetConfig("qr", !qr.isEnabled, {
                  qrEnabled: !qr.isEnabled,
                }),
            )}

            {qr.isEnabled && (
              <div className="p-3 space-y-3 bg-[#121214] rounded-b-lg animate-fadeIn">
                <div className="relative z-20">
                  <Select
                    label="Tài khoản thụ hưởng:"
                    size="sm"
                    value={qr.config.qrTarget || "both"}
                    options={[
                      {
                        label: "Chỉ hiển thị tài khoản Chú rể",
                        value: "groom",
                      },
                      {
                        label: "Chỉ hiển thị tài khoản Cô dâu",
                        value: "bride",
                      },
                      { label: "Hiển thị cả hai tài khoản", value: "both" },
                    ]}
                    onValueChange={(val) =>
                      onUpdateWidgetConfig("qr", true, { qrTarget: val as any })
                    }
                  />
                </div>

                <div className="space-y-3 relative z-10">
                  {(qr.config.qrTarget === "groom" ||
                    qr.config.qrTarget === "both") && (
                    <div className="space-y-2 p-3 bg-[#18181b] border border-zinc-850 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#d4af37] uppercase tracking-wider font-bold">
                          Tài khoản Chú rể
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <InputText
                          type="text"
                          label="Tên chủ thẻ:"
                          value={qr.config.groomAccountName || ""}
                          onChange={(e) =>
                            onUpdateWidgetConfig("qr", true, {
                              groomAccountName: e.target.value,
                            })
                          }
                        />
                        <InputText
                          type="text"
                          label="Số tài khoản:"
                          value={qr.config.groomAccountNumber || ""}
                          onChange={(e) =>
                            onUpdateWidgetConfig("qr", true, {
                              groomAccountNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Select
                        label="Ngân hàng đối tác:"
                        size="sm"
                        value={qr.config.groomBankName || ""}
                        options={BANK_OPTIONS}
                        onValueChange={(val) =>
                          onUpdateWidgetConfig("qr", true, {
                            groomBankName: val as string,
                          })
                        }
                      />
                      {qr.config.groomAccountName &&
                        qr.config.groomAccountNumber &&
                        qr.config.groomBankName && (
                          <div className="text-[9px] text-emerald-400 bg-emerald-500/5 px-2 py-1.5 rounded border border-emerald-500/20 text-center font-medium">
                            ✓ Hệ thống đã kích hoạt cổng VietQR tự động cho Chú
                            rể
                          </div>
                        )}
                    </div>
                  )}

                  {(qr.config.qrTarget === "bride" ||
                    qr.config.qrTarget === "both") && (
                    <div className="space-y-2 p-3 bg-[#18181b] border border-zinc-850 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-pink-400 uppercase tracking-wider font-bold">
                          Tài khoản Cô dâu
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <InputText
                          type="text"
                          label="Tên chủ thẻ:"
                          value={qr.config.brideAccountName || ""}
                          onChange={(e) =>
                            onUpdateWidgetConfig("qr", true, {
                              brideAccountName: e.target.value,
                            })
                          }
                        />
                        <InputText
                          type="text"
                          label="Số tài khoản:"
                          value={qr.config.brideAccountNumber || ""}
                          onChange={(e) =>
                            onUpdateWidgetConfig("qr", true, {
                              brideAccountNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Select
                        label="Ngân hàng đối tác:"
                        size="sm"
                        value={qr.config.brideBankName || ""}
                        options={BANK_OPTIONS}
                        onValueChange={(val) =>
                          onUpdateWidgetConfig("qr", true, {
                            brideBankName: val as string,
                          })
                        }
                      />
                      {qr.config.brideAccountName &&
                        qr.config.brideAccountNumber &&
                        qr.config.brideBankName && (
                          <div className="text-[9px] text-emerald-400 bg-emerald-500/5 px-2 py-1.5 rounded border border-emerald-500/20 text-center font-medium">
                            ✓ Hệ thống đã kích hoạt cổng VietQR tự động cho Cô
                            dâu
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border border-zinc-800/60 bg-[#16161a] transition-all ${gallery.isEnabled ? "relative z-15" : ""}`}
          >
            {renderWidgetHeader(
              "Album / Thư viện ảnh",
              <StackPhotoIcon width={16} height={16} />,
              gallery.isEnabled,
              () =>
                onUpdateWidgetConfig("gallery", !gallery.isEnabled, {
                  galleryEnabled: !gallery.isEnabled,
                }),
            )}

            {gallery.isEnabled && (
              <div className="p-3 space-y-3 bg-[#121214] rounded-b-lg animate-fadeIn">
                <div className="relative z-10">
                  <Select
                    label="Bố cục hiển thị Album:"
                    size="sm"
                    value={gallery.config.galleryLayout || "grid"}
                    options={[
                      {
                        label: "Dạng lưới tiêu chuẩn (Grid Layout)",
                        value: "grid",
                      },
                      {
                        label: "Dạng ghép nghệ thuật (Collage)",
                        value: "collage",
                      },
                      {
                        label: "Băng chuyền không gian (3D Carousel)",
                        value: "3d",
                      },
                    ]}
                    onValueChange={(val) =>
                      onUpdateWidgetConfig("gallery", true, {
                        galleryLayout: val as any,
                      })
                    }
                  />
                </div>

                <FileUpload
                  label="Hình ảnh album:"
                  mode="multi"
                  value={gallery.config.images || []}
                  onChange={(urls) =>
                    onUpdateWidgetConfig("gallery", true, {
                      images: urls,
                    })
                  }
                />
              </div>
            )}
          </div>

          <div className="rounded-lg border border-zinc-800/60 bg-[#16161a]">
            {renderWidgetHeader(
              "Nhúng Video Youtube",
              <VideoYoutubeIcon width={16} height={16} />,
              youtube.isEnabled,
              () =>
                onUpdateWidgetConfig("youtube", !youtube.isEnabled, {
                  youtubeEnabled: !youtube.isEnabled,
                }),
            )}

            {youtube.isEnabled && (
              <div className="p-3 space-y-3 bg-[#121214] rounded-b-lg animate-fadeIn">
                <InputText
                  type="text"
                  label="Đường dẫn Video đám cưới (Youtube URL):"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtube.config.youtubeUrl || ""}
                  onChange={(e) =>
                    onUpdateWidgetConfig("youtube", true, {
                      youtubeUrl: e.target.value,
                    })
                  }
                />

                {youtube.config.youtubeUrl && (
                  <div className="text-[10px] text-emerald-400 bg-emerald-500/5 rounded-lg px-2.5 py-1.5 border border-emerald-500/10 text-center font-medium">
                    ✓ Liên kết thành công. Video sẽ hiển thị trực quan trên
                    trình xem Canvas.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
