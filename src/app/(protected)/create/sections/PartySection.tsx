import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Switch from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";

interface PartySectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  tempMapUrl: string;
  setTempMapUrl: (url: string) => void;
  onSaveMap: () => Promise<void>;
}

export const PartySection = ({
  formData,
  handleChange,
  tempMapUrl,
  setTempMapUrl,
  onSaveMap,
}: PartySectionProps) => {
  return (
    <div className="bg-[#2D231F]/8 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-2">
        <h3 className="text-md font-bold text-[#2D231F]">7. Tiệc</h3>
        <Switch
          checked={formData.showParty}
          onChange={(val) => handleChange("showParty", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showParty && (
        <div className="flex flex-col gap-4">
          <RadioGroup
            value={formData.partyType}
            onValueChange={(val) => handleChange("partyType", val)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="wedding" id="party-wedding" />
              <Label
                htmlFor="party-wedding"
                className="text-sm text-[#2D231F] cursor-pointer"
              >
                Tiệc Cưới
              </Label>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="engagement" id="party-engagement" />
              <Label
                htmlFor="party-engagement"
                className="text-sm text-[#2D231F] cursor-pointer"
              >
                Tiệc Báo Hỷ
              </Label>
            </div>
          </RadioGroup>
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
          <div className="flex items-center justify-between bg-[#2D231F]/10 p-3 rounded-lg">
            <span className="text-sm">Hiển thị đồng hồ đếm ngược</span>
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
              className="bg-[#2D231F]/10! border-[#2D231F]/10!"
              placeholder="Nhập địa chỉ để tự động hiện bản đồ..."
            />
          </div>
          {formData.partyAddress && formData.showMap && (
            <div className="rounded-lg overflow-hidden border border-[#2D231F]/20 shadow-inner">
              <div className="text-[10px] text-[#2D231F]/40 px-2 py-1 bg-[#2D231F]/10">
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
          <div className="flex flex-col gap-2 p-3 border border-[#2D231F]/20 rounded-lg bg-[#2D231F]/8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2D231F]">
                Hiển thị Bản Đồ
              </span>
              <Switch
                checked={formData.showMap}
                onChange={(val) => handleChange("showMap", val)}
              />
            </div>
            {formData.showMap && (
              <div className="mt-2 flex flex-col gap-2">
                <Label className="text-xs font-medium text-[#2D231F]/60 mb-1">
                  URL Google Maps
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Input
                      value={tempMapUrl}
                      onChange={(e) => setTempMapUrl(e.target.value)}
                      className="bg-[#2D231F]/10! border-[#2D231F]/10!"
                      placeholder="Dán link hoặc iframe..."
                    />
                  </div>
                  <Button
                    onClick={onSaveMap}
                    className="bg-[#2D231F] text-[#F3EDE3] hover:bg-[#9db356] px-4 py-2 rounded-md font-semibold shrink-0"
                  >
                    Lưu
                  </Button>
                </div>
                <div className="text-[10px] text-gray-400 leading-tight">
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
