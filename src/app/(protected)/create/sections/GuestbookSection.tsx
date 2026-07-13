import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Switch from "@/components/ui/switch";

interface GuestbookSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

export const GuestbookSection = ({
  formData,
  handleChange,
}: GuestbookSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
        <h3 className="text-md font-bold text-[#d4af37]">
          11. Sổ lưu bút (Lời chúc)
        </h3>
        <Switch
          checked={formData.showGuestbook}
          onChange={(val) => handleChange("showGuestbook", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showGuestbook && (
        <div className="flex flex-col gap-3 pl-2">
          <Label className="flex items-center gap-3 cursor-pointer text-sm text-[#f5e6d3]">
            <Checkbox
              checked={formData.guestbookStatic}
              onCheckedChange={(checked) =>
                handleChange("guestbookStatic", checked)
              }
            />
            Hiển thị dạng tĩnh (Cuộn danh sách)
          </Label>
          <Label className="flex items-center gap-3 cursor-pointer text-sm text-[#f5e6d3]">
            <Checkbox
              checked={formData.guestbookFloating}
              onCheckedChange={(checked) =>
                handleChange("guestbookFloating", checked)
              }
            />
            Hiển thị linh động absolute lượn trên thiệp
          </Label>
        </div>
      )}
    </div>
  );
};
