import { MessengerIcon, PhoneIcon, ZaloIcon } from "@/assets/icons";
import FileUpload from "@/components/common/FileUpload";
import { invitationService } from "@/services/invitation.service";
import InputDate from "@/templates/customer-design/ui/input/InputDate";
import InputDateTime from "@/templates/customer-design/ui/input/InputDateTime";
import InputSwitch from "@/templates/customer-design/ui/input/InputSwitch";
import InputText from "@/templates/customer-design/ui/input/InputText";
import Select, {
  type SelectOption,
} from "@/templates/customer-design/ui/Select";
import { Check, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import ColorPickerRow from "../components/ColorPickerRow";
import type { EditorElement, WidgetConfig, WidgetType } from "../types";
import { UTILITY_FONTS } from "../utils/constants";

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

const INK = "#2D231F";

type CatalogItem = {
  type: WidgetType;
  title: string;
  description: string;
  defaults: Partial<WidgetConfig>;
};

type CatalogGroup = {
  label: string;
  items: CatalogItem[];
};

const CATALOG: CatalogGroup[] = [
  {
    label: "Sự kiện",
    items: [
      {
        type: "calendar",
        title: "Lịch",
        description: "Đánh dấu ngày trên lịch tháng",
        defaults: {
          calendarEnabled: true,
          calendarStyle: "classic",
          calendarDisplayMode: "full",
          color: INK,
          fontFamily: "Playfair Display",
          targetDate: new Date().toISOString().split("T")[0],
        },
      },
      {
        type: "countdown",
        title: "Đếm ngược",
        description: "Đếm ngày giờ tới sự kiện",
        defaults: {
          countdownEnabled: true,
          countdownType: "days-hours-min-sec",
          countdownOrientation: "horizontal",
          countdownStyle: "classic",
          color: INK,
          fontFamily: "Playfair Display",
        },
      },
    ],
  },
  {
    label: "Địa điểm",
    items: [
      {
        type: "map",
        title: "Bản đồ",
        description: "Dẫn đường tới nơi tổ chức",
        defaults: { mapEnabled: true, color: INK },
      },
    ],
  },
  {
    label: "Liên hệ",
    items: [
      {
        type: "call",
        title: "Liên hệ",
        description: "Gọi điện, Zalo, Messenger",
        defaults: {
          contactEnabled: true,
          phoneEnabled: true,
          contactActiveTab: "phone",
          phoneLabel: "Gọi điện",
        },
      },
      {
        type: "rsvp",
        title: "Xác nhận tham dự",
        description: "Form RSVP cho khách mời",
        defaults: { rsvpEnabled: true, rsvpType: "button", color: INK },
      },
    ],
  },
  {
    label: "Quà tặng",
    items: [
      {
        type: "qr",
        title: "Mã QR nhận quà",
        description: "VietQR cho một hoặc hai tài khoản",
        defaults: {
          qrEnabled: true,
          qrTarget: "both",
          qrTitle: "Gửi quà",
          groomLabel: "Tài khoản 1",
          brideLabel: "Tài khoản 2",
          color: INK,
        },
      },
    ],
  },
  {
    label: "Hình ảnh & video",
    items: [
      {
        type: "gallery",
        title: "Thư viện ảnh",
        description: "Lưới ảnh đều nhau",
        defaults: { galleryEnabled: true, galleryLayout: "grid", images: [] },
      },
      {
        type: "album",
        title: "Album ghép",
        description: "Collage nghệ thuật",
        defaults: {
          galleryEnabled: true,
          galleryLayout: "collage",
          images: [],
        },
      },
      {
        type: "carousel",
        title: "Carousel 3D",
        description: "Trượt ảnh không gian",
        defaults: { galleryEnabled: true, galleryLayout: "3d", images: [] },
      },
      {
        type: "youtube",
        title: "Video YouTube",
        description: "Nhúng video vào thiệp",
        defaults: { youtubeEnabled: true, color: INK },
      },
    ],
  },
];

const WIDGET_TITLE: Partial<Record<WidgetType, string>> = Object.fromEntries(
  CATALOG.flatMap((g) => g.items.map((i) => [i.type, i.title])),
);

function WidgetPreview({ type }: { type: WidgetType }) {
  if (type === "calendar") {
    return (
      <div className="flex h-full flex-col rounded-md bg-[#EDE4D5] p-1.5">
        <div className="mb-1 text-center text-[8px] font-bold tracking-wide text-[#2D231F]">
          THÁNG 8
        </div>
        <div className="grid flex-1 grid-cols-7 gap-0.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-xs ${i === 10 ? "bg-[#2D231F]" : "bg-[#F3EDE3]"}`}
            />
          ))}
        </div>
      </div>
    );
  }
  if (type === "countdown") {
    return (
      <div className="flex h-full items-center justify-center gap-1">
        {["12", "08", "30"].map((n) => (
          <div
            key={n}
            className="flex h-8 w-7 flex-col items-center justify-center rounded-md bg-[#2D231F] text-[#F3EDE3]"
          >
            <span className="text-[10px] font-bold leading-none">{n}</span>
            <span className="mt-0.5 text-[6px] opacity-70">ngày</span>
          </div>
        ))}
      </div>
    );
  }
  if (type === "map") {
    return (
      <div className="relative h-full overflow-hidden rounded-md bg-[#D9CDBE]">
        <div className="absolute inset-x-3 top-3 h-px bg-[#C4B09A]" />
        <div className="absolute inset-y-2 left-1/3 w-px bg-[#C4B09A]" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-full rounded-full border-2 border-[#2D231F] bg-[#C4B09A]" />
        <div className="absolute bottom-1.5 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#2D231F]/20" />
      </div>
    );
  }
  if (type === "call") {
    return (
      <div className="flex h-full items-center justify-center gap-1.5">
        {["#2D231F", "#7A6A5C", "#C4B09A"].map((c) => (
          <div
            key={c}
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    );
  }
  if (type === "rsvp") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1.5">
        <div className="h-5 w-10 rounded-sm border border-[#2D231F]/30 bg-[#F3EDE3]" />
        <div className="h-3 w-14 rounded-full bg-[#2D231F]" />
      </div>
    );
  }
  if (type === "qr") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="grid grid-cols-4 gap-px rounded-sm bg-[#2D231F] p-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 ${[0, 1, 2, 4, 8, 12, 13, 14].includes(i) ? "bg-[#F3EDE3]" : "bg-[#2D231F]"}`}
            />
          ))}
        </div>
      </div>
    );
  }
  if (type === "gallery") {
    return (
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5">
        {["#EDE4D5", "#D9CDBE", "#C4B09A", "#EDE4D5"].map((c, i) => (
          <div
            key={i}
            className="rounded-[3px]"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    );
  }
  if (type === "album") {
    return (
      <div className="relative h-full">
        <div className="absolute left-1 top-2 h-8 w-10 rotate-[-8deg] rounded-sm bg-[#D9CDBE]" />
        <div className="absolute right-1 top-1 h-9 w-10 rotate-6 rounded-sm bg-[#C4B09A]" />
        <div className="absolute bottom-1 left-1/2 h-8 w-10 -translate-x-1/2 rounded-sm bg-[#EDE4D5]" />
      </div>
    );
  }
  if (type === "carousel") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-5 -rotate-12 rounded-sm bg-[#D9CDBE]" />
        <div className="z-10 -mx-1 h-10 w-7 rounded-sm bg-[#2D231F]" />
        <div className="h-8 w-5 rotate-12 rounded-sm bg-[#C4B09A]" />
      </div>
    );
  }
  return (
    <div className="flex h-full items-center justify-center rounded-md bg-[#2D231F]">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#F3EDE3]">
        <div className="ml-0.5 h-0 w-0 border-y-4 border-l-[7px] border-y-transparent border-l-[#F3EDE3]" />
      </div>
    </div>
  );
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

const fontOptions: SelectOption[] = UTILITY_FONTS.map((f) => ({
  label: f,
  value: f,
  labelStyle: { fontFamily: f },
}));

export default function UtilityPanelContent({
  elements,
  selectedElement,
  onUpdateWidgetConfig,
  onSelect,
}: {
  elements: EditorElement[];
  selectedElement: EditorElement | null;
  onUpdateWidgetConfig: (
    widgetType: WidgetType,
    enabled: boolean,
    updates?: Partial<WidgetConfig>,
  ) => void;
  onSelect?: (id: string | null) => void;
}) {
  const [resolving, setResolving] = useState(false);

  const selectedWidget =
    selectedElement?.type === "widget" &&
    selectedElement.widgetType &&
    selectedElement.widgetType !== "music"
      ? selectedElement
      : null;

  const existingTypes = new Set(
    elements
      .filter((el) => el.type === "widget" && el.widgetType)
      .map((el) => el.widgetType as WidgetType),
  );

  const handleInsert = (item: CatalogItem) => {
    const existing = elements.find(
      (el) => el.type === "widget" && el.widgetType === item.type,
    );
    if (existing) {
      onSelect?.(existing.id);
      return;
    }
    onUpdateWidgetConfig(item.type, true, item.defaults);
  };

  if (selectedWidget?.widgetType) {
    const type = selectedWidget.widgetType;
    const config = selectedWidget.widgetConfig || {};
    const update = (updates: Partial<WidgetConfig>) =>
      onUpdateWidgetConfig(type, true, updates);

    return (
      <div
        onKeyDown={(e) => e.stopPropagation()}
        className="space-y-4 pb-10 text-xs"
      >
        <button
          type="button"
          onClick={() => onSelect?.(null)}
          className="text-left text-xs text-[#7A6A5C] transition-colors hover:text-[#2D231F]"
        >
          ← Thêm tiện ích khác
        </button>
        <div>
          <h3 className="text-sm font-semibold text-[#2D231F]">
            {WIDGET_TITLE[type] || "Tiện ích"}
          </h3>
          <p className="mt-0.5 text-[11px] text-[#7A6A5C]">
            Chỉnh nội dung trên canvas
          </p>
        </div>

        {type === "calendar" && (
          <CalendarConfig config={config} update={update} />
        )}
        {type === "countdown" && (
          <CountdownConfig config={config} update={update} />
        )}
        {type === "map" && (
          <MapConfig
            config={config}
            update={update}
            resolving={resolving}
            setResolving={setResolving}
          />
        )}
        {type === "call" && <CallConfig config={config} update={update} />}
        {type === "rsvp" && <RsvpConfig config={config} update={update} />}
        {type === "qr" && <QrConfig config={config} update={update} />}
        {(type === "gallery" || type === "album" || type === "carousel") && (
          <GalleryConfig config={config} update={update} type={type} />
        )}
        {type === "youtube" && (
          <YoutubeConfig config={config} update={update} />
        )}

        <button
          type="button"
          onClick={() => onUpdateWidgetConfig(type, false)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-400/30 py-2 text-xs text-red-500 transition-colors hover:bg-red-400/10"
        >
          <Trash2 size={12} />
          Gỡ khỏi thiệp
        </button>
      </div>
    );
  }

  return (
    <div onKeyDown={(e) => e.stopPropagation()} className="space-y-5 pb-10">
      <p className="text-[11px] leading-relaxed text-[#7A6A5C]">
        Chọn một tiện ích để chèn vào thiệp. Bấm lần nữa để chỉnh nội dung.
      </p>
      {CATALOG.map((group) => (
        <div key={group.label} className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
            {group.label}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {group.items.map((item) => {
              const onCanvas = existingTypes.has(item.type);
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleInsert(item)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-colors ${
                    onCanvas
                      ? "border-[#2D231F] bg-[#EDE4D5]"
                      : "border-[#D9CDBE] bg-[#F3EDE3] hover:border-[#2D231F] hover:bg-[#EDE4D5]"
                  }`}
                >
                  <div className="relative h-20 border-b border-[#D9CDBE]/80 bg-[#EDE4D5] p-2">
                    <WidgetPreview type={item.type} />
                    {onCanvas && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2D231F] text-[#F3EDE3]">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="text-[11px] font-semibold text-[#2D231F]">
                      {item.title}
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#7A6A5C]">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarConfig({
  config,
  update,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
}) {
  return (
    <div className="space-y-3.5">
      <InputDate
        label="Ngày sự kiện"
        value={config.targetDate || new Date().toISOString().split("T")[0]}
        onChange={(val) => update({ targetDate: val })}
      />
      <Select
        label="Kiểu hiển thị"
        size="sm"
        value={config.calendarDisplayMode || "full"}
        options={[
          { label: "Lịch tháng đầy đủ", value: "full" },
          { label: "Chỉ ngày (tối giản)", value: "date-only" },
        ]}
        onValueChange={(val) =>
          update({
            calendarDisplayMode: val as WidgetConfig["calendarDisplayMode"],
          })
        }
      />
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
          Giao diện
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "classic", label: "Cổ điển", desc: "Khung truyền thống" },
            { value: "modern", label: "Hiện đại", desc: "Góc bo mượt" },
            { value: "romantic", label: "Lãng mạn", desc: "Tone mềm" },
            { value: "luxury-navy", label: "Sang trọng", desc: "Navy & vàng" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                update({
                  calendarStyle: item.value as WidgetConfig["calendarStyle"],
                })
              }
              className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                (config.calendarStyle || "classic") === item.value
                  ? "border-[#2D231F] bg-[#2D231F]/10 text-[#2D231F]"
                  : "border-[#D9CDBE] bg-[#EDE4D5] text-[#7A6A5C] hover:border-[#2D231F]/30"
              }`}
            >
              <span className="text-[11px] font-bold text-[#2D231F]">
                {item.label}
              </span>
              <span className="mt-0.5 text-[9px] opacity-60">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
          Màu chủ đạo
        </label>
        <ColorPickerRow
          value={config.color || INK}
          onChange={(val) => update({ color: val })}
        />
      </div>
      <Select
        label="Font chữ"
        size="sm"
        searchable
        value={config.fontFamily || "Playfair Display"}
        options={fontOptions}
        onValueChange={(val) => update({ fontFamily: String(val) })}
      />
    </div>
  );
}

function CountdownConfig({
  config,
  update,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
}) {
  return (
    <div className="space-y-3">
      <InputDateTime
        label="Thời điểm sự kiện"
        value={config.countdownTarget || ""}
        onChange={(val) => update({ countdownTarget: val })}
      />
      <Select
        label="Đơn vị hiển thị"
        size="sm"
        value={config.countdownType || "days-hours-min-sec"}
        options={[
          { label: "Ngày · Giờ · Phút · Giây", value: "days-hours-min-sec" },
          { label: "Giờ · Phút · Giây", value: "hours-min-sec" },
        ]}
        onValueChange={(val) =>
          update({ countdownType: val as WidgetConfig["countdownType"] })
        }
      />
      <Select
        label="Bố cục"
        size="sm"
        value={config.countdownOrientation || "horizontal"}
        options={[
          { label: "Hàng ngang", value: "horizontal" },
          { label: "Hàng dọc", value: "vertical" },
        ]}
        onValueChange={(val) =>
          update({
            countdownOrientation: val as WidgetConfig["countdownOrientation"],
          })
        }
      />
      <Select
        label="Phong cách"
        size="sm"
        value={config.countdownStyle || "classic"}
        options={[
          { label: "Cổ điển", value: "classic" },
          { label: "Kính mờ", value: "modern" },
          { label: "Lãng mạn", value: "romantic" },
          { label: "Sang trọng", value: "luxury-navy" },
        ]}
        onValueChange={(val) =>
          update({ countdownStyle: val as WidgetConfig["countdownStyle"] })
        }
      />
      <div className="space-y-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
          Màu chữ số
        </label>
        <ColorPickerRow
          value={config.color || INK}
          onChange={(val) => update({ color: val })}
        />
      </div>
      <Select
        label="Font chữ số"
        size="sm"
        searchable
        value={config.fontFamily || "Playfair Display"}
        options={fontOptions}
        onValueChange={(val) => update({ fontFamily: String(val) })}
      />
    </div>
  );
}

function MapConfig({
  config,
  update,
  resolving,
  setResolving,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
  resolving: boolean;
  setResolving: (v: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <InputText
        type="text"
        label="Tên / địa chỉ địa điểm"
        placeholder="Ví dụ: Nhà hàng ABC, 12 Nguyễn Huệ..."
        value={config.locationAddress || ""}
        onChange={(e) => update({ locationAddress: e.target.value })}
      />
      <div className="space-y-1">
        <label className="mb-1 block text-[11px] font-medium text-[#7A6A5C]">
          Link Google Maps hoặc mã nhúng
        </label>
        <InputText
          type="text"
          placeholder="Dán link hoặc iframe..."
          value={config.mapEmbedUrl || ""}
          onChange={(e) => update({ mapEmbedUrl: e.target.value })}
        />
        <button
          type="button"
          disabled={resolving || !config.mapEmbedUrl?.trim()}
          onClick={async () => {
            const inputUrl = config.mapEmbedUrl?.trim();
            if (!inputUrl) return;
            setResolving(true);
            try {
              const res = await invitationService.resolveMapUrl(inputUrl);
              const resolvedUrl = res?.data?.url || inputUrl;
              const address =
                extractAddressFromMapUrl(resolvedUrl) ||
                config.locationAddress ||
                "";
              update({
                mapEmbedUrl: resolvedUrl,
                locationAddress: address || config.locationAddress,
              });
            } catch {
              //! error fallback
            }
            setResolving(false);
          }}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2D231F] px-3 py-1.5 text-xs font-semibold text-[#F3EDE3] transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {resolving ? <Loader2 size={12} className="animate-spin" /> : null}
          Tải dữ liệu bản đồ
        </button>
      </div>
      <Select
        label="Chế độ bản đồ"
        size="sm"
        value={config.mapType || "normal"}
        options={[
          { label: "Đường bộ", value: "normal" },
          { label: "Vệ tinh", value: "satellite" },
          { label: "Địa hình", value: "terrain" },
          { label: "Kết hợp", value: "hybrid" },
        ]}
        onValueChange={(val) =>
          update({ mapType: val as WidgetConfig["mapType"] })
        }
      />
    </div>
  );
}

function CallConfig({
  config,
  update,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
}) {
  const tab = config.contactActiveTab || "phone";
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 rounded-lg border border-[#D9CDBE]/60 bg-[#EDE4D5] p-1">
        {[
          { key: "phone" as const, icon: <PhoneIcon width={18} height={18} /> },
          {
            key: "messenger" as const,
            icon: <MessengerIcon width={18} height={18} />,
          },
          { key: "zalo" as const, icon: <ZaloIcon width={18} height={18} /> },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => update({ contactActiveTab: item.key })}
            className={`flex flex-1 items-center justify-center rounded-md py-2 transition-all ${
              tab === item.key
                ? "bg-[#2D231F] text-[#F3EDE3] shadow-sm"
                : "text-[#7A6A5C] hover:bg-[#2D231F]/8 hover:text-[#2D231F]"
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {tab === "phone" && (
        <div className="space-y-3 rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] p-3.5">
          <InputSwitch
            label="Hiện nút gọi điện"
            switchSize="sm"
            checked={!!config.phoneEnabled}
            onCheckedChange={(checked) => update({ phoneEnabled: checked })}
          />
          {config.phoneEnabled && (
            <>
              <InputText
                type="text"
                label="Nhãn hiển thị"
                value={config.phoneLabel || "Gọi điện"}
                onChange={(e) => update({ phoneLabel: e.target.value })}
              />
              <InputText
                type="tel"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại..."
                value={config.phoneNumber || ""}
                onChange={(e) => update({ phoneNumber: e.target.value })}
              />
            </>
          )}
        </div>
      )}

      {tab === "messenger" && (
        <div className="space-y-3 rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] p-3.5">
          <InputSwitch
            label="Hiện Messenger"
            switchSize="sm"
            checked={!!config.messengerEnabled}
            onCheckedChange={(checked) => update({ messengerEnabled: checked })}
          />
          {config.messengerEnabled && (
            <>
              <InputText
                type="text"
                label="Nhãn hiển thị"
                value={config.messengerLabel || "Messenger"}
                onChange={(e) => update({ messengerLabel: e.target.value })}
              />
              <InputText
                type="text"
                label="Link Messenger / Facebook"
                placeholder="https://m.me/..."
                value={config.messengerUrl || ""}
                onChange={(e) => update({ messengerUrl: e.target.value })}
              />
            </>
          )}
        </div>
      )}

      {tab === "zalo" && (
        <div className="space-y-3 rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] p-3.5">
          <InputSwitch
            label="Hiện Zalo"
            switchSize="sm"
            checked={!!config.zaloEnabled}
            onCheckedChange={(checked) => update({ zaloEnabled: checked })}
          />
          {config.zaloEnabled && (
            <>
              <InputText
                type="text"
                label="Nhãn hiển thị"
                value={config.zaloLabel || "Zalo"}
                onChange={(e) => update({ zaloLabel: e.target.value })}
              />
              <InputText
                type="tel"
                label="Số Zalo"
                placeholder="Nhập số điện thoại Zalo..."
                value={config.zaloPhone || ""}
                onChange={(e) => update({ zaloPhone: e.target.value })}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function RsvpConfig({
  config,
  update,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Cách hiển thị"
        size="sm"
        value={config.rsvpType || "full-form"}
        options={[
          { label: "Nút mở form", value: "button" },
          { label: "Form ngay trên thiệp", value: "full-form" },
        ]}
        onValueChange={(val) =>
          update({ rsvpType: val as WidgetConfig["rsvpType"] })
        }
      />
      <InputText
        type="email"
        label="Email nhận xác nhận"
        placeholder="ban@email.com"
        value={config.rsvpTargetEmail || ""}
        onChange={(e) => update({ rsvpTargetEmail: e.target.value })}
      />
      <InputSwitch
        label="Gửi email phản hồi tự động cho khách"
        switchSize="sm"
        checked={!!config.rsvpAutoConfirmEmail}
        onCheckedChange={(checked) => update({ rsvpAutoConfirmEmail: checked })}
      />
    </div>
  );
}

function QrConfig({
  config,
  update,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
}) {
  const target = config.qrTarget || "both";
  const label1 = config.groomLabel || "Tài khoản 1";
  const label2 = config.brideLabel || "Tài khoản 2";
  return (
    <div className="space-y-3">
      <InputText
        type="text"
        label="Tiêu đề nút"
        value={config.qrTitle || "Gửi quà"}
        onChange={(e) => update({ qrTitle: e.target.value })}
      />
      <Select
        label="Tài khoản hiển thị"
        size="sm"
        value={target}
        options={[
          { label: label1, value: "groom" },
          { label: label2, value: "bride" },
          { label: "Cả hai tài khoản", value: "both" },
        ]}
        onValueChange={(val) =>
          update({ qrTarget: val as WidgetConfig["qrTarget"] })
        }
      />
      {(target === "groom" || target === "both") && (
        <div className="space-y-2 rounded-lg border border-[#D9CDBE] bg-[#EDE4D5] p-3">
          <InputText
            type="text"
            label="Nhãn tài khoản"
            value={label1}
            onChange={(e) => update({ groomLabel: e.target.value })}
          />
          <InputText
            type="text"
            label="Tên chủ thẻ"
            value={config.groomAccountName || ""}
            onChange={(e) => update({ groomAccountName: e.target.value })}
          />
          <InputText
            type="text"
            label="Số tài khoản"
            value={config.groomAccountNumber || ""}
            onChange={(e) => update({ groomAccountNumber: e.target.value })}
          />
          <Select
            label="Ngân hàng"
            size="sm"
            value={config.groomBankName || ""}
            options={BANK_OPTIONS}
            onValueChange={(val) => update({ groomBankName: String(val) })}
          />
        </div>
      )}
      {(target === "bride" || target === "both") && (
        <div className="space-y-2 rounded-lg border border-[#D9CDBE] bg-[#EDE4D5] p-3">
          <InputText
            type="text"
            label="Nhãn tài khoản"
            value={label2}
            onChange={(e) => update({ brideLabel: e.target.value })}
          />
          <InputText
            type="text"
            label="Tên chủ thẻ"
            value={config.brideAccountName || ""}
            onChange={(e) => update({ brideAccountName: e.target.value })}
          />
          <InputText
            type="text"
            label="Số tài khoản"
            value={config.brideAccountNumber || ""}
            onChange={(e) => update({ brideAccountNumber: e.target.value })}
          />
          <Select
            label="Ngân hàng"
            size="sm"
            value={config.brideBankName || ""}
            options={BANK_OPTIONS}
            onValueChange={(val) => update({ brideBankName: String(val) })}
          />
        </div>
      )}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
          Màu chủ đạo
        </label>
        <ColorPickerRow
          value={config.color || INK}
          onChange={(val) => update({ color: val })}
        />
      </div>
    </div>
  );
}

function GalleryConfig({
  config,
  update,
  type,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
  type: WidgetType;
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Bố cục"
        size="sm"
        value={
          config.galleryLayout ||
          (type === "album" ? "collage" : type === "carousel" ? "3d" : "grid")
        }
        options={[
          { label: "Lưới", value: "grid" },
          { label: "Ghép ảnh (collage)", value: "collage" },
          { label: "Carousel 3D", value: "3d" },
        ]}
        onValueChange={(val) =>
          update({ galleryLayout: val as WidgetConfig["galleryLayout"] })
        }
      />
      <FileUpload
        label="Hình ảnh"
        mode="multi"
        value={config.images || []}
        onChange={(urls) =>
          update({
            images: Array.isArray(urls) ? urls : urls ? [urls] : [],
          })
        }
      />
    </div>
  );
}

function YoutubeConfig({
  config,
  update,
}: {
  config: WidgetConfig;
  update: (u: Partial<WidgetConfig>) => void;
}) {
  return (
    <div className="space-y-3">
      <InputText
        type="text"
        label="Link YouTube"
        placeholder="https://www.youtube.com/watch?v=..."
        value={config.youtubeUrl || ""}
        onChange={(e) => update({ youtubeUrl: e.target.value })}
      />
      {config.youtubeUrl && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-center text-[10px] font-medium text-emerald-700">
          Video sẽ phát trên thiệp khi khách mở.
        </div>
      )}
    </div>
  );
}
