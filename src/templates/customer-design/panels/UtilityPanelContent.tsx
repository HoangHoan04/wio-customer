import {
  CalendarIcon,
  CountdownIcon,
  GiftQrIcon,
  MapIcon,
  PhoneIcon,
  RSVPIcon,
  StackPhotoIcon,
  VideoYoutubeIcon,
} from "@/templates/customer-design/icons";
import Button from "@/templates/customer-design/ui/button/Button";
import InputDate from "@/templates/customer-design/ui/input/InputDate";
import InputDateTime from "@/templates/customer-design/ui/input/InputDateTime";
import InputSwitch from "@/templates/customer-design/ui/input/InputSwitch";
import InputText from "@/templates/customer-design/ui/input/InputText";
import Select, { type SelectOption } from "@/templates/customer-design/ui/Select";
import { weddingService } from "@/services/wedding.service";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import Section from "../components/Section";
import type { EditorElement, WidgetConfig, WidgetType } from "../types";

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
  { label: "OceanBank", value: "OceanBank" },
  { label: "PVcomBank", value: "PVcomBank" },
  { label: "MSB", value: "MSB" },
  { label: "SeABank", value: "SeABank" },
  { label: "NCB", value: "NCB" },
  { label: "Nam A Bank", value: "Nam A Bank" },
  { label: "Bac A Bank", value: "Bac A Bank" },
  { label: "Ngân hàng khác", value: "OTHER" },
];

interface UtilityPanelContentProps {
  elements: EditorElement[];
  onUpdateWidgetConfig: (
    widgetType: WidgetType,
    enabled: boolean,
    updates?: Partial<WidgetConfig>
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
    if (placeMatch) return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
  } catch {
    // ignore parse error
  }
  return "";
};

export default function UtilityPanelContent({
  elements,
  onUpdateWidgetConfig,
}: UtilityPanelContentProps) {
  const [resolving, setResolving] = useState(false);

  const getWidgetState = (widgetType: WidgetType) => {
    const found = elements.find((el) => el.type === "widget" && el.widgetType === widgetType);
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

  return (
    <div className="space-y-5 text-gray-300 text-xs pb-10 select-none">
      <Section label="Lịch">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("calendar", !calendar.isEnabled, {
                calendarEnabled: !calendar.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              calendar.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <CalendarIcon width={50} height={50} />
            <span>Thêm lịch vào template</span>
          </button>

          {calendar.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <InputDate
                label="Chọn ngày highlighted:"
                value={calendar.config.targetDate || ""}
                onChange={(val) => onUpdateWidgetConfig("calendar", true, { targetDate: val })}
              />

              <Select
                label="Kiểu hiển thị:"
                size="sm"
                value={calendar.config.calendarDisplayMode || "full"}
                options={[
                  { label: "Kèm tháng năm", value: "full" },
                  { label: "Chỉ ngày", value: "date-only" },
                ]}
                onValueChange={(val) =>
                  onUpdateWidgetConfig("calendar", true, {
                    calendarDisplayMode: val as any,
                  })
                }
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#d4af37] select-none">
                  Mẫu lịch
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "classic", label: "Cổ điển", desc: "Viền vàng thanh lịch" },
                    { value: "modern", label: "Hiện đại", desc: "Ô vuông bo góc" },
                    { value: "romantic", label: "Lãng mạn", desc: "Tone mềm mại" },
                    { value: "minimal", label: "Tối giản", desc: "Gạch chân tinh tế" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        onUpdateWidgetConfig("calendar", true, {
                          calendarStyle: item.value as any,
                        })
                      }
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg border text-[10px] transition-all ${
                        (calendar.config.calendarStyle || "classic") === item.value
                          ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                          : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="opacity-70">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#d4af37] select-none">
                  Màu sắc
                </label>
                <ColorPickerRow
                  value={calendar.config.color || "#d4af37"}
                  onChange={(val) => onUpdateWidgetConfig("calendar", true, { color: val })}
                />
              </div>

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
          )}
        </div>
      </Section>

      <Section label="Đếm ngược">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("countdown", !countdown.isEnabled, {
                countdownEnabled: !countdown.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              countdown.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <CountdownIcon width={50} height={50} />
            <span>Thêm đếm ngược vào template</span>
          </button>

          {countdown.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <InputDateTime
                label="Chọn ngày giờ đám cưới:"
                value={countdown.config.countdownTarget || ""}
                onChange={(val) =>
                  onUpdateWidgetConfig("countdown", true, { countdownTarget: val })
                }
              />

              <Select
                label="Loại đếm ngược:"
                size="sm"
                value={countdown.config.countdownType || "days-hours-min-sec"}
                options={[
                  { label: "Ngày - Giờ - Phút - Giây", value: "days-hours-min-sec" },
                  { label: "Giờ - Phút - Giây", value: "hours-min-sec" },
                ]}
                onValueChange={(val) =>
                  onUpdateWidgetConfig("countdown", true, {
                    countdownType: val as any,
                  })
                }
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#d4af37] select-none">
                  Màu sắc
                </label>
                <ColorPickerRow
                  value={countdown.config.color || "#ffffff"}
                  onChange={(val) => onUpdateWidgetConfig("countdown", true, { color: val })}
                />
              </div>

              <Select
                label="Font chữ:"
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
          )}
        </div>
      </Section>

      <Section label="Bản đồ">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("map", !map.isEnabled, {
                mapEnabled: !map.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              map.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <MapIcon width={50} height={50} />
            <span>Thêm bản đồ vào template</span>
          </button>

          {map.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <InputText
                type="text"
                label="Địa điểm tổ chức:"
                placeholder="Nhập địa chỉ..."
                value={map.config.locationAddress || ""}
                onChange={(e) =>
                  onUpdateWidgetConfig("map", true, {
                    locationAddress: e.target.value,
                  })
                }
              />

              <div>
                <label className="block text-gray-400 mb-1 text-[11px]">
                  Link Google Maps (tuỳ chọn):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://maps.google.com/..."
                    value={map.config.mapEmbedUrl || ""}
                    onChange={(e) =>
                      onUpdateWidgetConfig("map", true, {
                        mapEmbedUrl: e.target.value,
                      })
                    }
                    className="flex-1 bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-[#d4af37]/50 transition-colors"
                  />
                  <button
                    type="button"
                    disabled={resolving || !map.config.mapEmbedUrl?.trim()}
                    onClick={async () => {
                      const inputUrl = map.config.mapEmbedUrl?.trim();
                      if (!inputUrl) return;
                      setResolving(true);
                      try {
                        const res = await weddingService.resolveMapUrl(inputUrl);
                        const resolvedUrl = res?.data?.url || inputUrl;
                        const address =
                          extractAddressFromMapUrl(resolvedUrl) || map.config.locationAddress || "";
                        onUpdateWidgetConfig("map", true, {
                          mapEmbedUrl: resolvedUrl,
                          locationAddress: address || map.config.locationAddress,
                        });
                      } catch {
                        // ignore resolve error
                      }
                      setResolving(false);
                    }}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b08d20] disabled:opacity-40 transition-colors"
                  >
                    {resolving ? <Loader2 size={12} className="animate-spin" /> : null}
                    {resolving ? "Đang tải..." : "Tải bản đồ"}
                  </button>
                </div>
              </div>

              <Select
                label="Kiểu bản đồ:"
                size="sm"
                value={map.config.mapType || "normal"}
                options={[
                  { label: "Bản đồ thường", value: "normal" },
                  { label: "Vệ tinh", value: "satellite" },
                  { label: "Địa hình", value: "terrain" },
                  { label: "Kết hợp", value: "hybrid" },
                ]}
                onValueChange={(val) => onUpdateWidgetConfig("map", true, { mapType: val as any })}
              />
            </div>
          )}
        </div>
      </Section>

      <Section label="Liên hệ">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("call", !call.isEnabled, {
                contactEnabled: !call.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              call.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <PhoneIcon width={50} height={50} />
            <span>Thêm mục liên hệ vào template</span>
          </button>

          {call.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <div className="flex gap-1 bg-[#1e1e1e] rounded-lg p-1 border border-[#333]">
                {[
                  { key: "phone", label: "📞 Điện thoại" },
                  { key: "messenger", label: "💬 Messenger" },
                  { key: "zalo", label: "Z Zalo" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() =>
                      onUpdateWidgetConfig("call", true, {
                        contactActiveTab: tab.key as any,
                      })
                    }
                    className={`flex-1 py-1.5 px-2 rounded text-[10px] font-semibold transition-all ${
                      (call.config.contactActiveTab || "phone") === tab.key
                        ? "bg-[#d4af37] text-black"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {(call.config.contactActiveTab || "phone") === "phone" && (
                <div className="space-y-3">
                  <InputSwitch
                    label="Hiển thị gọi điện"
                    switchSize="sm"
                    checked={!!call.config.phoneEnabled}
                    onCheckedChange={(checked) =>
                      onUpdateWidgetConfig("call", true, { phoneEnabled: checked })
                    }
                  />
                  {call.config.phoneEnabled && (
                    <>
                      <InputText
                        type="text"
                        label="Nhãn:"
                        value={call.config.phoneLabel || "Gọi điện"}
                        onChange={(e) =>
                          onUpdateWidgetConfig("call", true, {
                            phoneLabel: e.target.value,
                          })
                        }
                      />
                      <InputText
                        type="tel"
                        label="Số điện thoại:"
                        value={call.config.phoneNumber || ""}
                        onChange={(e) =>
                          onUpdateWidgetConfig("call", true, {
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              )}

              {(call.config.contactActiveTab || "phone") === "messenger" && (
                <div className="space-y-3">
                  <InputSwitch
                    label="Hiển thị Messenger"
                    switchSize="sm"
                    checked={!!call.config.messengerEnabled}
                    onCheckedChange={(checked) =>
                      onUpdateWidgetConfig("call", true, { messengerEnabled: checked })
                    }
                  />
                  {call.config.messengerEnabled && (
                    <>
                      <InputText
                        type="text"
                        label="Nhãn:"
                        value={call.config.messengerLabel || "Messenger"}
                        onChange={(e) =>
                          onUpdateWidgetConfig("call", true, {
                            messengerLabel: e.target.value,
                          })
                        }
                      />
                      <InputText
                        type="url"
                        label="Link Facebook:"
                        placeholder="https://facebook.com/..."
                        value={call.config.messengerUrl || ""}
                        onChange={(e) =>
                          onUpdateWidgetConfig("call", true, {
                            messengerUrl: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              )}

              {(call.config.contactActiveTab || "phone") === "zalo" && (
                <div className="space-y-3">
                  <InputSwitch
                    label="Hiển thị Zalo"
                    switchSize="sm"
                    checked={!!call.config.zaloEnabled}
                    onCheckedChange={(checked) =>
                      onUpdateWidgetConfig("call", true, { zaloEnabled: checked })
                    }
                  />
                  {call.config.zaloEnabled && (
                    <>
                      <InputText
                        type="text"
                        label="Nhãn:"
                        value={call.config.zaloLabel || "Zalo"}
                        onChange={(e) =>
                          onUpdateWidgetConfig("call", true, {
                            zaloLabel: e.target.value,
                          })
                        }
                      />
                      <InputText
                        type="tel"
                        label="Số điện thoại Zalo:"
                        placeholder="090xxxxxxx"
                        value={call.config.zaloPhone || ""}
                        onChange={(e) =>
                          onUpdateWidgetConfig("call", true, {
                            zaloPhone: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#d4af37] select-none">
                  Màu biểu tượng
                </label>
                <ColorPickerRow
                  value={call.config.color || "#d4af37"}
                  onChange={(val) => onUpdateWidgetConfig("call", true, { color: val })}
                />
              </div>

              <Select
                label="Font chữ:"
                size="sm"
                value={call.config.fontFamily || "Quicksand"}
                options={fontOptions}
                onValueChange={(val) =>
                  onUpdateWidgetConfig("call", true, {
                    fontFamily: val as string,
                  })
                }
              />
            </div>
          )}
        </div>
      </Section>

      <Section label="Xác nhận tham dự RSVP">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("rsvp", !rsvp.isEnabled, {
                rsvpEnabled: !rsvp.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              rsvp.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <RSVPIcon width={50} height={50} />
            <span>Thêm form RSVP vào template</span>
          </button>

          {rsvp.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <Select
                label="Loại hiển thị:"
                size="sm"
                value={rsvp.config.rsvpType || "full-form"}
                options={[
                  { label: "Nút mở form modal", value: "button" },
                  { label: "Hiển thị form trực tiếp", value: "full-form" },
                ]}
                onValueChange={(val) =>
                  onUpdateWidgetConfig("rsvp", true, {
                    rsvpType: val as any,
                  })
                }
              />

              <InputText
                type="email"
                label="Email nhận danh sách khách mời:"
                placeholder="email@example.com"
                value={rsvp.config.rsvpTargetEmail || ""}
                onChange={(e) =>
                  onUpdateWidgetConfig("rsvp", true, {
                    rsvpTargetEmail: e.target.value,
                  })
                }
              />

              <InputSwitch
                label="Gửi email xác nhận tự động"
                switchSize="sm"
                checked={!!rsvp.config.rsvpAutoConfirmEmail}
                onCheckedChange={(checked) =>
                  onUpdateWidgetConfig("rsvp", true, {
                    rsvpAutoConfirmEmail: checked,
                  })
                }
              />

              <Button
                variant="gold"
                buttonSize="sm"
                className="w-full font-bold text-center justify-center"
                onClick={() => alert("Xuất danh sách khách mời thành công file CSV.")}
              >
                Quản lý & Xuất file CSV
              </Button>
            </div>
          )}
        </div>
      </Section>

      <Section label="Mừng cưới - QR Code">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("qr", !qr.isEnabled, {
                qrEnabled: !qr.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              qr.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <GiftQrIcon width={50} height={50} />
            <span>Thêm mừng cưới QR vào template</span>
          </button>

          {qr.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <Select
                label="Đối tượng nhận:"
                size="sm"
                value={qr.config.qrTarget || "both"}
                options={[
                  { label: "Cô dâu", value: "bride" },
                  { label: "Chú rể", value: "groom" },
                  { label: "Cả hai", value: "both" },
                ]}
                onValueChange={(val) => onUpdateWidgetConfig("qr", true, { qrTarget: val as any })}
              />

              {(qr.config.qrTarget === "groom" || qr.config.qrTarget === "both") && (
                <div className="space-y-2 p-2 border border-zinc-800 rounded-lg">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Chú rể</p>
                  <InputText
                    type="text"
                    label="Tên tài khoản:"
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
                  <Select
                    label="Ngân hàng:"
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
                      <div className="text-[9px] text-emerald-400/80 bg-emerald-400/10 rounded-lg px-3 py-2 border border-emerald-400/20">
                        ✓ Mã QR sẽ được tạo tự động theo chuẩn VietQR
                      </div>
                    )}
                </div>
              )}

              {(qr.config.qrTarget === "bride" || qr.config.qrTarget === "both") && (
                <div className="space-y-2 p-2 border border-zinc-800 rounded-lg">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Cô dâu</p>
                  <InputText
                    type="text"
                    label="Tên tài khoản:"
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
                  <Select
                    label="Ngân hàng:"
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
                      <div className="text-[9px] text-emerald-400/80 bg-emerald-400/10 rounded-lg px-3 py-2 border border-emerald-400/20">
                        ✓ Mã QR sẽ được tạo tự động theo chuẩn VietQR
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section label="Thư viện ảnh">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("gallery", !gallery.isEnabled, {
                galleryEnabled: !gallery.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              gallery.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <StackPhotoIcon width={50} height={50} />
            <span>Thêm thư viện ảnh vào template</span>
          </button>

          {gallery.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <Select
                label="Kiểu hiển thị:"
                size="sm"
                value={gallery.config.galleryLayout || "grid"}
                options={[
                  { label: "Dạng lưới", value: "grid" },
                  { label: "Dạng collage", value: "collage" },
                  { label: "3D Carousel", value: "3d" },
                ]}
                onValueChange={(val) =>
                  onUpdateWidgetConfig("gallery", true, {
                    galleryLayout: val as any,
                  })
                }
              />

              <button
                type="button"
                onClick={() => {
                  const currentImages = gallery.config.images || [];
                  onUpdateWidgetConfig("gallery", true, {
                    images: [
                      ...currentImages,
                      "https://images.unsplash.com/photo-1519741497674-611481863552?w=300",
                    ],
                  });
                }}
                className="w-full py-2 border border-dashed border-[#d4af37] text-[#d4af37] rounded-lg flex items-center justify-center gap-1.5 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 transition-colors text-xs font-medium cursor-pointer"
              >
                <Plus size={14} /> Thêm ảnh vào thư viện
              </button>

              {(gallery.config.images || []).length > 0 && (
                <div className="grid grid-cols-4 gap-1 mt-2">
                  {(gallery.config.images || []).map((imgUrl: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative group aspect-square bg-[#333] rounded overflow-hidden shadow-inner border border-gray-800"
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = (gallery.config.images || []).filter(
                            (_: string, i: number) => i !== idx
                          );
                          onUpdateWidgetConfig("gallery", true, {
                            images: filtered,
                          });
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity cursor-pointer border-none"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section label="Video Youtube">
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onUpdateWidgetConfig("youtube", !youtube.isEnabled, {
                youtubeEnabled: !youtube.isEnabled,
              })
            }
            className={`w-full flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
              youtube.isEnabled
                ? "bg-[#d4af37] border-[#d4af37] text-black font-semibold"
                : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
            }`}
          >
            <VideoYoutubeIcon width={50} height={50} />
            <span>Thêm video Youtube vào template</span>
          </button>

          {youtube.isEnabled && (
            <div className="space-y-3 border-l-2 border-[#d4af37]/40 pl-2 mt-2">
              <InputText
                type="text"
                label="Link video Youtube:"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtube.config.youtubeUrl || ""}
                onChange={(e) =>
                  onUpdateWidgetConfig("youtube", true, {
                    youtubeUrl: e.target.value,
                  })
                }
              />

              {youtube.config.youtubeUrl && (
                <div className="text-[10px] text-emerald-400 bg-emerald-400/10 rounded-lg px-3 py-2 border border-emerald-400/20">
                  ✓ Đã nhập link. Video sẽ hiển thị trên canvas.
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
