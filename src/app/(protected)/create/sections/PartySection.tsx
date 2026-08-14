import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Switch from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";

interface PartySectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  tempMapUrl: string;
  setTempMapUrl: (url: string) => void;
  onSaveMap: () => Promise<void>;
  formConfig?: CardTypeFormConfig;
}

export const PartySection = ({
  formData,
  handleChange,
  tempMapUrl,
  setTempMapUrl,
  onSaveMap,
  formConfig,
}: PartySectionProps) => {
  const sectionTitle = formConfig?.partyTitle || "7. Tiệc";
  const partyTypes = formConfig?.partyTypes || [
    { value: "wedding", label: "Tiệc Cưới" },
    { value: "engagement", label: "Tiệc Báo Hỷ" },
  ];

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">{sectionTitle}</h3>
        <Switch
          checked={formData.showParty}
          onChange={(val) => handleChange("showParty", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showParty && (
        <div className="flex flex-col gap-4">
          {partyTypes.length > 1 && (
            <RadioGroup
              value={formData.partyType}
              onValueChange={(val) => handleChange("partyType", val)}
              className="flex gap-6"
            >
              {partyTypes.map((pt) => (
                <div key={pt.value} className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value={pt.value} id={`party-${pt.value}`} />
                  <Label
                    htmlFor={`party-${pt.value}`}
                    className="text-sm font-medium text-[#2D231F] cursor-pointer"
                  >
                    {pt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#2D231F]/80">
              Ngày tổ chức
            </Label>
            <DatePicker
              value={formData.partyDate}
              onChange={(val) => handleChange("partyDate", val)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
                Đón khách lúc
              </Label>
              <TimePicker
                value={formData.partyWelcomeTime}
                onChange={(val) => handleChange("partyWelcomeTime", val)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
                Khai tiệc lúc
              </Label>
              <TimePicker
                value={formData.partyStartTime}
                onChange={(val) => handleChange("partyStartTime", val)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between bg-[#F3EDE3] border border-[#D9CDBE] p-3 rounded-xl">
            <span className="text-xs sm:text-sm font-medium text-[#2D231F]">Hiển thị đồng hồ đếm ngược</span>
            <Switch
              checked={formData.showCountdown}
              onChange={(val) => handleChange("showCountdown", val)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#2D231F]/80">
              Địa chỉ tổ chức tiệc
            </Label>
            <Input
              value={formData.partyAddress}
              onChange={(e) =>
                handleChange("partyAddress", e.target.value)
              }
              className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
              placeholder="Nhập địa chỉ để tự động hiện bản đồ..."
            />
          </div>
          {formData.partyAddress && formData.showMap && (
            <div className="rounded-xl overflow-hidden border border-[#D9CDBE] shadow-2xs">
              <div className="text-[11px] text-[#2D231F]/60 font-medium px-3 py-1.5 bg-[#F3EDE3] border-b border-[#D9CDBE]">
                Xem trước bản đồ theo địa chỉ
              </div>
              <iframe
                width="100%"
                height="180"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.partyAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          )}
          <div className="flex flex-col gap-3 p-4 border border-[#D9CDBE] rounded-xl bg-[#F3EDE3]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-[#2D231F]">
                Hiển thị Bản Đồ
              </span>
              <Switch
                checked={formData.showMap}
                onChange={(val) => handleChange("showMap", val)}
              />
            </div>
            {formData.showMap && (
              <div className="mt-2 flex flex-col gap-2">
                <Label className="text-xs font-semibold text-[#2D231F]/80 mb-1">
                  URL Google Maps
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Input
                      value={tempMapUrl}
                      onChange={(e) => setTempMapUrl(e.target.value)}
                      className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
                      placeholder="Dán link hoặc iframe..."
                    />
                  </div>
                  <Button
                    onClick={onSaveMap}
                    className="bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] px-4 py-2 rounded-lg font-semibold shrink-0 cursor-pointer"
                  >
                    Lưu
                  </Button>
                </div>
                <div className="text-[10.5px] text-[#2D231F]/60 leading-tight">
                  Nhập URL chia sẻ (hiển thị nút Chỉ đường) hoặc dán mã
                  nhúng {"<iframe...>"}
                  để thay đổi khung Bản đồ. Khung bản đồ mặc định sẽ tự
                  tạo theo "Địa chỉ tổ chức tiệc".
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
